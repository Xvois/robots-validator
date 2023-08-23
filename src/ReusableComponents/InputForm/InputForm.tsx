import React, {SetStateAction, useEffect, useState} from "react";
import {fetchExamples, fetchRobots} from "../../Functions/FetchingFuncs";
import {AxiosError} from "axios";
import {Input} from "../../ShadComponents/ui/input"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "../../ShadComponents/ui/form";
import {Button} from "../../ShadComponents/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../ShadComponents/ui/select";


/**
 * Returns if the URL is valid to get a txt from through a simple
 * regex.
 * @param url
 * @returns boolean
 */
export const urlIsValid = (url: string) => {
    const regex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    const match = url?.match(regex);
    return !!match;
}

function parseURL(inputURL: string): URL | null {
    try {
        // Add "http://" if the input doesn't start with any protocol
        if (!/^https?:\/\//i.test(inputURL)) {
            inputURL = "https://" + inputURL;
        }

        return new URL(inputURL);
    } catch (error) {
        console.error("Invalid URL:", error);
        return null;
    }
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
    const [fetchError, setFetchError] = useState(undefined as unknown as AxiosError);

    useEffect(() => {
        const url = urlParams.get('target-url');
        if (url) {
            const urlObject = parseURL(url);
            if (urlObject) {
                setFetchError(undefined as unknown as AxiosError);
                fetchRobots(urlObject)
                    .then((res) => {
                        setRobots(res);
                    })
                    .catch((err) => {
                        setFetchError(err);
                        console.warn(err)
                    });
            }
        }
    }, []);

    useEffect(() => {

        fetchExamples(selectedPlatform).then(function ([good, bad]) {
                setGoodExample(good);
                setBadExample(bad);
            }
        );

    }, [selectedPlatform]);

    const handleSubmit = (data: z.infer<typeof formSchema>) => {
        console.info("Submit sent!")

        const {url, platform} = data;

        const urlObject = parseURL(url);

        setSelectedPlatform(platform);

        console.log({url, platform});

        if (urlObject) {
            setRobots(undefined as unknown as string);
            setFetchError(undefined as unknown as AxiosError);

            fetchRobots(urlObject)
                .then((res) => {
                    setRobots(res);

                    if (res.includes("we use Shopify as our ecommerce platform")) {
                        setSelectedPlatform("Shopify");
                    }
                })
                .catch((err) => {
                    setFetchError(err);
                    console.warn(err);
                });

            urlParams.set('target-url', url);
            urlParams.set('platform', platform);
            window.history.pushState({}, '', `?${urlParams.toString()}`);
        } else {
            console.log("Invalid URL:", url);
        }
    };

    const formSchema = z.object({
        url: z.string().refine((val) => urlIsValid(val), {message: "Must be a valid url."}),
        platform: z.string({required_error: "A target platform must be selected."})
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            url: urlParams.get('target-url') || "",
            platform: urlParams.get('platform') || undefined
        },
        context: "onSubmit"
    })

    return (
        <div className={""}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}
                      className="inline-flex flex-wrap w-full justify-around items-start gap-5">
                    <FormField
                        control={form.control}
                        name="url"
                        render={({field}) => (
                            <FormItem className={"flex-grow"}>
                                <FormLabel>URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://google.com" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Target URL for the robots.txt file.
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="platform"
                        render={({field}) => (
                            <FormItem className="flex-grow">
                                <FormLabel>Target platform</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a target platform"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {platforms.map(platform => {
                                                return <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                                            })}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                                <FormDescription>
                                    Platform best practices to test against.
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                    <div className={"flex items-center h-[100px]"}>
                        <Button type="submit" aria-label="Submit">Submit</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}