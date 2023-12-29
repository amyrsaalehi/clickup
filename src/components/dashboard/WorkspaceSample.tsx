export default function WorkspaceSample() {
    return Array(5).fill(0).map((_, idx) => (
        <div className="join join-vertical w-full" key={idx}>
            <div className="collapse collapse-arrow join-item border border-base-300">
                <input type="radio" name="my-accordion-4" />
                <div className="collapse-title text-xl font-medium">
                    Workspace {idx + 1}
                </div>
                <div className="collapse-content py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center gap-5">
                        {
                            Array(5).fill(0).map((_, idx) => {
                                /** Cause to raise the bug, after implementing query to db this would be deleted! Just for show! */
                                const number = Math.floor(Math.random() * 100);
                                return (
                                    <ul key={idx} className="list-disc px-4">
                                        <li>
                                            <div className="flex gap-3 flex-col pb-4 md:pb-0">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-1">
                                                        <h4 className="text-xl font-bold">Task {idx + 1}</h4>
                                                        <span className="text-success/75 text-sm">({number}%)</span>
                                                    </div>
                                                    <progress
                                                        className={`progress min-w-56 w-full ${number > 75 ? 'progress-success' : number < 75 && number >= 50 ? 'progress-warning' : 'progress-error'}`}
                                                        value={number} max="100"
                                                    />
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    ))

}
