import React, {FormEvent, SetStateAction, useEffect, useState} from "react";
import {fetchExamples, fetchRobots} from "../Functions/FetchingFuncs";


/**
 * Returns if the URL is valid to get a txt from through a simple
 * regex.
 * @param url
 * @returns boolean
 */
export const urlIsValid = (url: string) => {
    const regex = "^(http(s):\\/\\/.)[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&\\/\\/=]*)$";
    const match = url?.match(regex);
    return !!match;
}

interface UserAgent {
    pattern: string,
    url?: string,
    instances: string[]
}

/**
 * This component deals with taking the user inputs for the robots file
 * and will modify the state of the parent robots and examples files
 * to match such inputs.
 * @param props
 * @constructor
 */
export function InputForm(
    props:
        {
            userAgents: UserAgent[],
            platforms: string[],
            setRobots: React.Dispatch<SetStateAction<string>>,
            setGoodExample: React.Dispatch<SetStateAction<string>>,
            setBadExample: React.Dispatch<SetStateAction<string>>
        }) {
    const {userAgents, platforms, setRobots, setGoodExample, setBadExample} = props;
    const urlParams = new URLSearchParams(window.location.search);
    const [selectedPlatform, setSelectedPlatform] = useState(urlParams.get('platform') || platforms[0]);
    const [url, setURL] = useState(urlParams.get('target-url') || '');
    const [selectedUserAgent, setSelectedUserAgent] = useState(userAgents.find(agent => agent.pattern === urlParams.get('agent-pattern')) || userAgents[0]);

    useEffect(() => {
        if (url) {
            fetchRobots(new URL(url))
                .then((res) => setRobots(res))
                .catch((err) => console.error(err));
        }
    }, []);

    useEffect(() => {

        const fetchData = async () => {
            const [goodExample, badExample] = await fetchExamples(selectedPlatform);
            setGoodExample(goodExample);
            setBadExample(badExample);
        }

        fetchData();

    }, [selectedPlatform]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (urlIsValid(url)) {
            fetchRobots(new URL(url))
                .then((res) => setRobots(res))
                .catch((err) => console.error(err));

            urlParams.set('target-url', url);
            urlParams.set('agent-pattern', selectedUserAgent.pattern);
            urlParams.set('platform', selectedPlatform);
            window.history.pushState({}, '', `?${urlParams.toString()}`);
        }

    };


    const modifyUserAgent = (targetPattern: string) => {
        const agent = userAgents.find(agent => agent.pattern === targetPattern);
        if (agent) {
            setSelectedUserAgent(agent);
        } else {
            console.warn(`Agent with pattern ${targetPattern} not found!`);
        }
    };

    return (
        <div style={{display: 'flex', flexDirection: 'row', gap: '20px'}}>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    id="url-input"
                    name="url-input"
                    required
                    value={url}
                    onChange={(e) => setURL(e.target.value)} // Update URL state on input change
                />
                {/*
                    <select
                        value={selectedUserAgent.pattern}
                        onChange={(e) => modifyUserAgent(e.target.value)}
                    >
                        {userAgents.map((agent: UserAgent) => (
                            <option key={agent.pattern} value={agent.pattern}>
                                {agent.pattern}
                            </option>
                        ))}
                    </select>
                */}
                {platforms.map(platform => {
                    return (
                        <div key={platform}>
                            <input
                                type={'radio'}
                                id={platform}
                                name={"platform"}
                                value={platform}
                                onChange={(e) => setSelectedPlatform(e.target.value)}
                                checked={platform === selectedPlatform}
                            />
                            <label htmlFor={platform}>{platform}</label>
                        </div>
                    )
                })}
                <button disabled={!urlIsValid(url)} type={'submit'}>Test</button>
            </form>
        </div>
    );
}