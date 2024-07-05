import { Meteor } from 'meteor/meteor';
import { fetch } from 'meteor/fetch';
import { Repository } from '/types/Repository';

const getGithubService = async () => {
    const user = await Meteor.userAsync()
    return user?.services.github ?? false
}

Meteor.methods({
    async 'github.repos.list'(): Promise<Repository[]> {
        const service = await getGithubService()

        if (service) {
            try {
                const response = await fetch("https://api.github.com/user/repos", {
                    headers: {
                        Accept: "application / vnd.github + json",
                        Authorization: `Bearer ${service.accessToken}`,
                        "X-GitHub-Api-Version": "2022-11-28"
                    }
                });
                const data = await response.json()

                if(data.status === "401"){
                    throw new Meteor.Error("401", "Bad credentials")
                }

                return data
            }
            catch (e) {
                throw new Meteor.Error(e.message)
            }
        }
    },
    async 'isGithubUser'(){
        return !!(await getGithubService())
    }
})  