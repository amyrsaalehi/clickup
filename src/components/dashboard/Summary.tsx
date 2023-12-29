import { type Dispatch, type SetStateAction } from "react";

export default function Summary({ setTab }: { setTab: Dispatch<SetStateAction<number>> }) {
    return (
        <div>
            <div role="alert" className="alert alert-warning">
                <div className="flex md:items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span className="text-left">You don't have any Workspace, Do you want to create one? Click Go to Workspace Tab.</span>
                </div>
                <div className="ml-auto">
                    <button className="btn btn-sm btn-neutral" onClick={() => setTab(1)}>Workspaces</button>
                </div>
            </div>
        </div>
    )
}
