import React, {SetStateAction, useState} from "react";
import userAgents from "../../user-agents.json";
import axios from "axios";
import TextField from "@mui/material/TextField";
import {MenuItem, Select} from "@mui/material";


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

export function InputForm(
    props:
        {
            setRobots: React.Dispatch<SetStateAction<string>>
        }) {
    const {setRobots} = props;
    const [url, setURL] = useState(null as unknown as string);
    const [selectedAgentName, setSelectedAgentName] = useState(userAgents[0].agentName);

    const getRobots = () => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        const source = axios.CancelToken.source();

        const axiosConfig = {
            signal: signal,
            cancelToken: source.token,
            "User-Agent": selectedAgentName,
        };

        axios.get(url + "robots.txt", axiosConfig)
            .then((res) => setRobots(res.data))
            .catch(error => console.log(error));

        return () => {
            source.cancel("Canceled by cleanup.");
        }
    }

    return (
        <div>
            <div style={{display: 'flex', flexDirection: 'row', gap: '20px'}}>
                <TextField
                    required
                    id="filled-required"
                    label="Target URL"
                    variant="filled"
                    onChange={(e) => setURL(e.target.value)}
                />
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    variant="filled"
                    label="User Agent"
                    value={selectedAgentName}
                    onChange={(e) => setSelectedAgentName(e.target.value as string)}
                >
                    {
                        userAgents.map((agent: UserAgent) => (
                            <MenuItem key={agent.agentName} value={agent.agentName}>
                                {agent.displayName}
                            </MenuItem>
                        ))
                    }
                </Select>
                <button disabled={!isUrlValid(url)} onClick={getRobots}>Test</button>
            </div>
        </div>
    );
}