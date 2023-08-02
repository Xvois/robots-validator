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
    displayName: string,
    agentName: string
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
    const [selectedAgentName, setSelectedAgentName] = useState(urlParams.get('agent-name') || userAgents[0].agentName);

    useEffect(() => {
        if (url) {
            getRobots();
        }
    }, []);

    useEffect(() => {
        const fetchExamples = async () => {
            const [goodFile, badFile] = [await axios.get(`/${selectedPlatform}/good-practice-robots.txt`), await axios.get(`/${selectedPlatform}/bad-practice-robots.txt`)];
            setGoodExample(goodFile.data);
            setBadExample(badFile.data);
        }
        fetchExamples();

    }, [selectedPlatform]);

    const getRobots = () => {

        const abortController = new AbortController();
        const signal = abortController.signal;
        const source = axios.CancelToken.source();

        const axiosConfig = {
            signal: signal,
            cancelToken: source.token,
            "User-Agent": selectedAgentName,
            timeout: 1000
        };

        axios.get(url + "robots.txt", axiosConfig)
            .then((res) => {
                setRobots(res.data);

                // Append search parameters to the URL without refreshing the page
                urlParams.set('target-url', url);
                window.history.pushState({}, '', `?${urlParams.toString()}`);

                urlParams.set('agent-name', selectedAgentName);
                window.history.pushState({}, '', `?${urlParams.toString()}`);

                urlParams.set('platform', selectedPlatform);
                window.history.pushState({}, '', `?${urlParams.toString()}`);

            })
            .catch(error => console.log(error));

        return () => {
            source.cancel("Canceled by cleanup.");
        }
    }

    return (
        <div>
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
                    <select
                        value={selectedAgentName}
                        onChange={(e) => setSelectedAgentName(e.target.value)} // Update selectedAgentName state on selection change
                    >
                        {userAgents.map((agent: UserAgent) => (
                            <option key={agent.agentName} value={agent.agentName}>
                                {agent.displayName}
                            </option>
                        ))}
                    </select>
                    {platforms.map(platform => {
                        return (
                            <>
                                <input
                                    type={'radio'}
                                    id={platform}
                                    name={"platform"}
                                    value={platform}
                                    onChange={(e) => setSelectedPlatform(e.target.value)}
                                    checked={platform === selectedPlatform}
                                />
                                <label htmlFor={platform}>{platform}</label>
                            </>
                        )

                    })}
                    <button type={'submit'}>Test</button>
                </form>
            </div>
        </div>
    );
}