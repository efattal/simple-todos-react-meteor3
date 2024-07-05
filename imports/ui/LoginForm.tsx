import { Alert, Button, Card, Label, TextInput } from 'flowbite-react';
import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { MdErrorOutline } from "react-icons/md";
import { FaGithub, FaGoogle, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
export const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<Error | Meteor.Error | Meteor.TypedError>()

    const submit = e => {
        e.preventDefault();

        Meteor.loginWithPassword(username, password, setError);
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <Card className="p-4">
                    <Button color="light" className="w-full" onClick={() => Meteor.loginWithGoogle({
                        requestPermissions: ['email', 'profile']
                    }, (error) => {
                        if (error) { console.log(error); }
                    })}>
                        <FaGoogle className="w-5 h-5 mr-2"/>
                        Log in with Google
                    </Button>
                    <Button color="light" className="w-full" onClick={() => Meteor.loginWithLinkedin({
                        requestPermissions: ["openid", "profile", "email", "w_member_social"]
                    }, (error) => {
                        if (error) { console.log(error); }
                    })}>
                        <FaLinkedin className="w-5 h-5 mr-2" />
                        Log in with LinkedIn
                    </Button>
                    <Button color="light" className="w-full" onClick={() => Meteor.loginWithGithub({
                        loginStyle: "redirect",
                        requestPermissions: ["user"]
                    }, (error) => {
                        if (error) { console.log(error); }
                    })}>
                        <FaGithub className="w-5 h-5 mr-2" />
                        Log in with Github
                    </Button>
                    <Button color="light" className="w-full" onClick={() => Meteor.loginWithTwitter({
                        loginStyle: "redirect",
                    }, (error) => {
                        if (error) { console.log(error); }
                    })}>
                        <FaXTwitter className="w-5 h-5 mr-2" />
                        Log in with X (Twitter)
                    </Button>
                    <div className="inline-flex items-center justify-center w-full">
                        <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700 bg-inherit"  />
                        <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 left-1/2 dark:text-white bg-white dark:bg-gray-800">or</span>
                    </div>
                    <form className="flex max-w-md flex-col gap-4"
                        onSubmit={submit}>
                        {error && <Alert color="failure" icon={MdErrorOutline}>{error.message}</Alert>}
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="username" value="Your username" />
                            </div>
                            <TextInput id="username" placeholder="User name" required onChange={e => setUsername(e.target.value)} />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="password" value="Your password" />
                            </div>
                            <TextInput id="password" type="password" placeholder="••••••••" required onChange={e => setPassword(e.target.value)} />
                        </div>
                        {/* <div className="flex items-center gap-2">
                        <Checkbox id="remember" />
                        <Label htmlFor="remember">Remember me</Label>
                    </div> */}
                        <Button type="submit">Submit</Button>
                    </form>
                </Card>
            </div>
        </section>
    );
};