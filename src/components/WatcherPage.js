import { Watcher } from './Watcher'
import { useState } from 'react'

export const WatcherPage = () => {
    const [projectName, setProjectName] = useState('')
    const [watcherName, setWatcherName] = useState('')

    const handleChange = (event) => {
        setProjectName(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        setWatcherName(projectName)
    }

    return (
        <div style={{ padding: 40 }}>
            {!watcherName && (
                <form>
                    <label>
                        Enter Magic eden project name:{' '}
                        <input
                            type="text"
                            name="projectName"
                            onChange={handleChange}
                        />
                    </label>
                    <button onClick={handleSubmit} disabled={!!watcherName}>
                        Submit
                    </button>
                </form>
            )}
            {watcherName && (
                <Watcher chartType={'Floor'} projectName={watcherName} />
            )}
            {watcherName && (
                <Watcher chartType={'Listed'} projectName={watcherName} />
            )}
            {watcherName && (
                <Watcher
                    chartType={'Volume/Floor Price'}
                    projectName={watcherName}
                />
            )}
        </div>
    )
}
