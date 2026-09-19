import { useEffect, useState } from "react"

import Axios from "axios"
import styles from './Repo.module.css'

type Repo = {
    id: number
    name: string
    html_url: string
    description: string | null
    language: string | null
    stargazers_count: number
    updated_at: string
}

export const fetchApiData = async (username: string) => {
    const response = await Axios.get(
        `https://api.github.com/users/${username}/repos`
    )
    return response.data
}

export function sortByMostRecentDate(repos: Repo[] | undefined) {
    if (repos !== undefined)
        return repos.sort(
            (a, b) => +new Date(b.updated_at) - +new Date(a.updated_at)
        )
}

export function arrayToLength(array: Repo[] | undefined, length: number) {
    if (array) return array.splice(0, length)
}

export function removeDash(string: string) {
    return string.replace(/-/g, " ")
}

export function convertToHours(seconds: number) {
    if (seconds >= 63072000) return `${Math.floor(seconds / 31536000)} years ago`
    if (seconds >= 31536000) return `${Math.floor(seconds / 31536000)} year ago`
    if (seconds >= 5184000) return `${Math.floor(seconds / 2592000)} months ago`
    if (seconds >= 2592000) return `${Math.floor(seconds / 2592000)} month ago`
    if (seconds >= 1209600) return `${Math.floor(seconds / 604800)} weeks ago`
    if (seconds >= 604800) return `${Math.floor(seconds / 604800)} week ago`
    if (seconds >= 172800) return `${Math.floor(seconds / 86400)} days ago`
    if (seconds >= 86400) return `${Math.floor(seconds / 86400)} day ago`
    if (seconds >= 7200) return `${Math.floor(seconds / 3600)} hours ago`
    if (seconds >= 3600) return `${Math.floor(seconds / 3600)} hour ago`
    if (seconds >= 120) return `${Math.floor(seconds / 60)} minutes ago`
    if (seconds >= 60) return `${Math.floor(seconds / 60)} minute ago`
    if (seconds < 60) return `${Math.floor(seconds)} seconds ago`
}

export const getRemainingSeconds = (previousDate: number, currentDate: number) => {
    return Math.floor((currentDate - previousDate) / 1000)
}

function GitRepos({ userName, numOfrepos, showLanguage }: {
    userName: string
    numOfrepos: number
    showLanguage: boolean
}) {
    const [repoData, setRepoData] = useState<Repo[]>([])
    useEffect(() => {
        fetchApiData(userName).then(setRepoData)
    }, [userName])
    const sortedRepos = sortByMostRecentDate(repoData)
    const sortedAndReducedRepos = arrayToLength(sortedRepos, numOfrepos)
    return (
        <ul className={styles.repoList}>
            {sortedAndReducedRepos
                ? sortedAndReducedRepos.map((repo) => (
                    <li key={repo.id} className={styles.repoRow}>
                        <a
                            className={styles.repoLink}
                            href={repo.html_url}
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <div className={styles.repoMain}>
                                <span className={styles.repoTitle}>
                                    {removeDash(repo.name)}
                                </span>
                                <p className={styles.repoDescription}>
                                    {repo.description || 'No description provided.'}
                                </p>
                            </div>
                            <div className={styles.repoMeta}>
                                {showLanguage && repo.language ? (
                                    <span className={styles.repoLanguage}>
                                        {repo.language}
                                    </span>
                                ) : null}
                                <p className={styles.repoUpdated}>
                                    updated {convertToHours(
                                        getRemainingSeconds(new Date(repo.updated_at).getTime(), Date.now())
                                    )}
                                </p>
                            </div>
                        </a>
                    </li>
                ))
                : null}
        </ul>
    )
}

export default GitRepos

