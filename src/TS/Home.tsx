import '../CSS/index.css';
import '../CSS/Home.css';
import React, {SetStateAction, useEffect, useState} from "react";
import TextField from '@mui/material/TextField';
import {MenuItem, Select, Tooltip} from "@mui/material";
import userAgents from "../user-agents.json";
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

function InputForm(
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

function RobotsDisplay(props: {
    robots: string
}) {

    interface Comment {
        type: "NECESSARY" | "INFO" | "WARNING" | "ERROR",
        message: string,
        index: number
    }
    const typeRegex = /# ([A-Z ]+) \|/;
    const messageRegex = /\| (.+)/;

    const {robots} = props;
    const [goodExample, setGoodExample] = useState(undefined as unknown as string);
    const [badExample, setBadExample] = useState(undefined as unknown as string);
    /**
     * Split up the lines in to an array.
     * This makes line by line comparisons easy.
     * **/
    const goodExampleArray = goodExample?.split('\n');
    const badExampleArray = badExample?.split('\n');
    const robotsArray = robots?.split('\n');
    const [allComments, setAllComments] = useState(undefined as unknown as Comment[]);
    const errors = allComments?.filter(c => c.type === "ERROR");
    const warnings = allComments?.filter(c => c.type === "WARNING");
    /**
     * We don't want to rerender until all comments
     * are submitted, so we fill partial comments first.
     */
    let partialComments : Comment[] = [];
    const [isReady, setIsReady] = useState(false);

    /**
     * Returns an array of comments
     * of a warning type for any lines marked
     * NECESSARY in a good practice file
     * but not found in the provided file.
     * @returns Comment[]
     */
    const getWarningsForMissingLines = () => {
        const warnings : Comment[] = [];
        goodExampleArray?.forEach((goodLine, index) => {
            // We assume we are looking at a comment of a line.
            // If we are not then these just resolve to empty strings
            // and the line is missed.
            const typeMatch = goodLine.match(typeRegex);
            const type = typeMatch ? typeMatch[1] : "";

            const messageMatch = goodLine.match(messageRegex);
            const message = messageMatch ? messageMatch[1] : "";
            if(type === "NECESSARY"){
                if(!robotsArray.some(providedLine => providedLine === goodExampleArray[index + 1])){
                    warnings.push({
                        type: "WARNING",
                        message: `${goodExampleArray[index + 1]} is missing. ${message}`,
                        index: -1
                    })
                }
            }
        })
        return warnings;
    }

    useEffect(() => {
        setIsReady(!!robots && !!goodExample && !!badExample);
    }, [robots, goodExample, badExample]);

    useEffect(() => {
        const fetchExamples = async () => {
            const [goodFile, badFile] = [await axios.get("/good-practice-robots.txt"), await axios.get("/bad-practice-robots.txt")];
            setGoodExample(goodFile.data);
            setBadExample(badFile.data);
        }
        fetchExamples();
    }, []);

    const getFormattedLine = (line: string, lineIndex: number) => {

        const parseForComment = (array: string[], line: string) => {
            //                                    We use direct comparison here.
            //                                    Lines must be **identical**.
            const index = array.findIndex(l => l === line);

            if (index <= 0 || !array[index - 1].startsWith('#')) {
                return null;
            }

            const rawComment = array[index - 1] + '\n';

            // Regex match for the title and message of the comment

            const typeMatch = rawComment.match(typeRegex);
            const messageMatch = rawComment.match(messageRegex);

            const type = typeMatch ? typeMatch[1] : "";
            const message = messageMatch ? messageMatch[1] : "";

            const comment : Comment = {
                // @ts-ignore
                type: type,
                message: message,
                index: lineIndex
            };

            return comment;
        }

        const comment = parseForComment(goodExampleArray, line) || parseForComment(badExampleArray, line);

        if(comment !== null) {
            partialComments.push(comment)
        }

        /**
         * This is the last line to be checked, so we can
         * safely perform a state change.
         */
        if(lineIndex === robotsArray?.length - 1 && !allComments) {
            // Now we have gone through every line, find what was missing
            // and create comments for that.
            const missingLineComments = getWarningsForMissingLines();
            partialComments = partialComments.concat(missingLineComments);

            setAllComments(partialComments);
        }

        return (
            // We won't render comments
            !line.startsWith('#') &&
                <li key={lineIndex} className={comment ? 'robots-line-wrapper ' + comment.type.toLowerCase() : 'robots-line-wrapper'}>
                    {comment !== null ?
                    <Tooltip disableFocusListener title={comment.message} arrow placement={"right"}>
                        <code>
                            {line}
                        </code>
                    </Tooltip>
                    :
                    <code>{line}</code>
                    }
                </li>

        )
    }

    return (
        isReady ?
            <div className={'robots-wrapper'}>
                <ol className={'robots-list'}>
                    {robotsArray.map((line, index) => {
                        return getFormattedLine(line, index);
                    })
                    }
                </ol>
                {allComments &&
                    <div className={'robots-summary'}>
                        <div>
                            <p>{errors.length} error{errors.length !== 1 && 's'}</p>
                            <ul>
                                {errors.map(comment => {
                                    return (
                                        <li>
                                            <p>
                                                ERROR: {robotsArray[comment.index]}
                                            </p>
                                            <p>
                                                {comment.message}
                                            </p>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                        <div>
                            <p>{warnings.length} warning{warnings.length !== 1 && 's'}</p>
                            <ul>
                                {warnings.map(comment => {
                                    return (
                                        <li>
                                            <p>
                                                WARNING: {robotsArray[comment.index]}
                                            </p>
                                            <p>
                                                {comment.message}
                                            </p>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                }

            </div>

            :
            <></>
    )
}

function Home() {

    const [robots, setRobots] = useState(undefined as unknown as string);

    return (
        <>
            <h1>Robots.txt validator</h1>
            <InputForm setRobots={setRobots}/>
            <RobotsDisplay robots={robots}/>
        </>
    )
}

export default Home;