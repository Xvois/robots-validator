import React, {SetStateAction, useEffect, useState} from "react";
import axios from "axios";


/**
 * Returns if the URL is valid to get a txt from through a simple
 * regex.
 * @param url
 * @returns boolean
 */
export const isUrlValid = (url: string) => {
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
            return getRobots();
        }
    }, []);

    useEffect(() => {
        const fetchExamples = async () => {
            const [goodFile, badFile] = [await axios.get(`/${selectedPlatform}/good-practice-robots.txt`), await axios.get(`/${selectedPlatform}/bad-practice-robots.txt`)];
            setGoodExample(goodFile.data);
            setBadExample(badFile.data);
        }
        fetchExamples();

        urlParams.set('platform', selectedPlatform);

        // Append search parameters to the URL without refreshing the page
        window.history.pushState({}, '', `?${urlParams.toString()}`);

    }, [selectedPlatform]);

    const getRobots = () => {

        const abortController = new AbortController();
        const signal = abortController.signal;
        const source = axios.CancelToken.source();

        const axiosConfig = {
            signal: signal,
            cancelToken: source.token,
            timeout: 1000
        };

        const cleanupMessage = "Canceled by cleanup.";

        axios.get(url + "robots.txt", axiosConfig)
            .then((res) => {
                setRobots(res.data);

                urlParams.set('target-url', url);
                urlParams.set('agent-pattern', selectedUserAgent.pattern);
                urlParams.set('platform', selectedPlatform);

                // Append search parameters to the URL without refreshing the page
                window.history.pushState({}, '', `?${urlParams.toString()}`);
            })
            .catch(error => {
                if (error.message !== cleanupMessage) {
                    console.warn(error);
                }
            });

        return () => {
            source.cancel(cleanupMessage);
        }
    }

    const modifyUserAgent = (targetPattern: string) => {
        const agent = userAgents.find(agent => agent.pattern === targetPattern);
        if (agent) {
            setSelectedUserAgent(agent);
        } else {
            console.warn(`Agent with pattern ${targetPattern} not found!`);
        }
    }

    return (
        <div style={{display: 'flex', flexDirection: 'row', gap: '20px'}}>
            <form onSubmit={(e) => {
                e.preventDefault();
                getRobots();
            }}>
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
                <button disabled={!isUrlValid(url)} type={'submit'}>Test</button>
            </form>
        </div>
    );
}