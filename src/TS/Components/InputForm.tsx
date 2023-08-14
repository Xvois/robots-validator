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
            platforms: string[],
            setRobots: React.Dispatch<SetStateAction<string>>,
            setGoodExample: React.Dispatch<SetStateAction<string>>,
            setBadExample: React.Dispatch<SetStateAction<string>>,
        }) {
    const {platforms, setRobots, setGoodExample, setBadExample} = props;
    const urlParams = new URLSearchParams(window.location.search);
    const [selectedPlatform, setSelectedPlatform] = useState(urlParams.get('platform') || platforms[0]);
    const [url, setURL] = useState(urlParams.get('target-url') || '');
    const [fetchError, setFetchError] = useState(undefined as unknown as AxiosError);

    useEffect(() => {
        if (url) {
            setFetchError(undefined as unknown as AxiosError);
            fetchRobots(new URL(url))
                .then((res) => {
                    setRobots(res);
                })
                .catch((err) => {
                    setFetchError(err);
                    console.warn(err)
                });
        }
    }, [setRobots, url]);

    useEffect(() => {

        fetchExamples(selectedPlatform).then(function ([good, bad]) {
                setGoodExample(good);
                setBadExample(bad);
            }
        );

    }, [selectedPlatform, setGoodExample, setBadExample]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (urlIsValid(url)) {
            setRobots(undefined as unknown as string);
            setFetchError(undefined as unknown as AxiosError);

            fetchRobots(new URL(url))
                .then((res) => {
                    setRobots(res);

                    if(res.includes("we use Shopify as our ecommerce platform")){
                        setSelectedPlatform("Shopify")
                    }

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
        <div id={'input-form-wrapper'}>
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
                                    sx={{fontFamily: '"Poppins", sans-serif', margin: 0}}
                                />
                            )
                        })}
                    </RadioGroup>
                </FormControl>
            </form>
        </div>
    );
}