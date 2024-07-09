import React, { useEffect, useState } from "react"
import { Meteor } from 'meteor/meteor';
import { Repository } from "/types/Repository"
import { ListGroup, Spinner } from "flowbite-react"

const Repositories = () => {
    const [repos, setRepos] = useState<Repository[]>()
    
    useEffect(() => {
        Meteor.call("github.repos.list", (err, list) => {
            if (err) {
                if (confirm("Bad Github credentials. Reconnect?")) {
                    Meteor.logout()
                }
            }
            else {
                setRepos(list)
            }
        })
    }, [])

    return (
        repos ? (
            <ListGroup>
                {repos.map((repo) => (
                    <ListGroup.Item href={repo.html_url} target="_blank" key={repo.id}>
                        <div>
                            <div>{repo.name}</div>
                            <div className="text-xs mt-1 font-thin">{repo.description}</div>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        ) : (
            <Spinner />
        )
    )
}

export default Repositories