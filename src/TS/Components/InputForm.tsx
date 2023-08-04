import React, {FormEvent, SetStateAction, useEffect, useState} from "react";
import {fetchExamples, fetchRobots} from "../Functions/FetchingFuncs";
import {FormControl, FormControlLabel, RadioGroup} from "@mui/material";
import {AxiosError} from "axios";
import {StyledRadio, StyledTextField} from "./StyledComponents";
import "../../CSS/InputForm.css"


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
            setBadExample: React.Dispatch<SetStateAction<string>>,
        }) {
    const {userAgents, platforms, setRobots, setGoodExample, setBadExample} = props;
    const urlParams = new URLSearchParams(window.location.search);
    const [selectedPlatform, setSelectedPlatform] = useState(urlParams.get('platform') || platforms[0]);
    const [url, setURL] = useState(urlParams.get('target-url') || '');
    const [fetchError, setFetchError] = useState(undefined as unknown as AxiosError);

    useEffect(() => {
        if (url) {
            fetchRobots(new URL(url))
                .then((res) => {
                    setRobots(res);
                    setFetchError(undefined as unknown as AxiosError);
                })
                .catch((err) => {
                    setFetchError(err);
                    console.warn(err)
                });
        }
    }, []);

    useEffect(() => {

        fetchExamples(selectedPlatform).then(function ([good, bad]) {
                setGoodExample(good);
                setBadExample(bad);
            }
        );

    }, [selectedPlatform]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();


        if (urlIsValid(url)) {
            setRobots(undefined as unknown as string);
            fetchRobots(new URL(url))
                .then((res) => {
                    setRobots(res);
                    setFetchError(undefined as unknown as AxiosError);
                })
                .catch((err) => {
                    setFetchError(err);
                    console.warn(err)
                });

            urlParams.set('target-url', url);
            urlParams.set('platform', selectedPlatform);
            window.history.pushState({}, '', `?${urlParams.toString()}`);
        }

    };

    return (
        <div style={{display: 'flex', flexDirection: 'row', gap: '20px', margin: '20px 0'}}>
            <form onSubmit={handleSubmit}>
                <FormControl sx={{display: 'flex', flexDirection: 'column'}}>
                    <div id={'text-field-radio-group-wrapper'}>
                        <StyledTextField
                            fullWidth
                            required
                            size={'small'}
                            id="url-field"
                            label="URL"
                            error={!!fetchError}
                            defaultValue={url}
                            helperText={fetchError ? `${fetchError.name}: ${fetchError.message}` : ''}
                            variant="outlined"
                            onChange={(e) => setURL(e.target.value)}
                        />
                        <button id={'submission-button'} disabled={!urlIsValid(url)} type={'submit'}>Test</button>
                    </div>
                    <RadioGroup
                        row
                        name={'platform-radio-controlled'}
                        value={selectedPlatform}
                        onChange={(e) => setSelectedPlatform(e.target.value)}
                    >
                        {platforms.map(platform => {
                            return (
                                <FormControlLabel
                                    key={platform}
                                    control={<StyledRadio/>}
                                    value={platform}
                                    label={platform}
                                />
                            )
                        })}
                    </RadioGroup>
                </FormControl>
            </form>
        </div>
    );
}