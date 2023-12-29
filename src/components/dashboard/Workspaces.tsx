import { useState } from "react";
import WorkspaceSample from "./WorkspaceSample";

export default function Workspaces() {
  const [form, setForm] = useState({
    title: '',
    assignees: '',
  });
  const [assignees, setAssignees] = useState<string[]>([]);

  console.log(assignees);

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* <div role="alert" className="alert alert-warning">
          <div className="flex md:items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span className="text-left">You don't have any Workspace, Do you want to create one?</span>
          </div>
          <div className="ml-auto">
            <button className="btn btn-sm btn-neutral" onClick={() => document.getElementById('workspace_modal')!.showModal()}>Create</button>
          </div>
        </div> */}
        <WorkspaceSample />
      </div>
      <dialog id="workspace_modal" className="modal modal-bottom md:modal-middle">
        <div className="modal-box w-full md:w-[90vw] md:max-w-[1280px]">
          <div className="flex flex-col gap-5">
            <h3 className="font-bold text-lg">Create Workspace</h3>
            <label className="form-control w-full">
              <input type="text" placeholder="Title" className={`input input-bordered w-full`}
                value={form.title}
                onChange={(e) => {
                  setForm({ ...form, title: e.target.value });
                }}
              />
            </label>
            <label className="form-control w-full">
              <input type="text" placeholder="Enter Developers' Emails separated by SPACE" className={`input input-bordered w-full`}
                value={form.assignees}
                onChange={(e) => {
                  setForm({ ...form, assignees: e.target.value });
                  setAssignees(e.target.value.split(' '));
                }}
              />
            </label>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn btn-outline btn-error">Cancel</button>
                <button className="btn btn-success ml-3">Create</button>
              </form>
            </div>
          </div>
        </div>
      </dialog>
    </>
  )
}
