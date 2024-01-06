import { IoMdAdd } from "react-icons/io";
import { useState } from "react";
import WorkspaceList from "./WorkspaceList";
import { api } from "~/utils/api";
import Cookies from "js-cookie";

const initForm = {
  title: '',
  tasks: [''],
};

export default function Workspaces() {
  const [form, setForm] = useState(initForm);
  const [toast, setToast] = useState<null | 'ERROR' | 'SUCCESS'>(null);
  const workspacesQuery = api.workspace.getAll.useQuery();
  const me = api.user.me.useQuery({ token: Cookies.get('token')! });
  const workspaceCreate = api.workspace.create.useMutation({
    onSuccess: () => {
      void workspacesQuery.refetch();
      setToast('SUCCESS');
      setTimeout(() => setToast(null), 1000);
    },
    onError: () => {
      setToast('ERROR');
      setTimeout(() => setToast(null), 1000);
    }
  });

  const doIHaveAnyWorkspace = workspacesQuery.data?.some((workspace) => workspace.userId === me.data?.id);

  const handleSubmit = () => {
    workspaceCreate.mutate({
      title: form.title,
      userId: me.data?.id ? me.data?.id : 0,
      tasks: form.tasks.map((task) => ({
        title: task,
      }))
    });
    handleCancel();
  }

  const handleCancel = () => {
    setForm(initForm);
  }

  const handleAddRow = () => {
    const prevRowsClone = [...form.tasks];
    setForm({
      ...form,
      tasks: [...prevRowsClone, '']
    })
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {
          doIHaveAnyWorkspace ? (
            <div role="alert" className="alert shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <div>
                <div className="text-sm capitalize text-left">You Can click on Create button and create new workspace</div>
              </div>
              <button className="btn ml-auto btn-neutral" onClick={() => document.getElementById('workspace_modal')!.showModal()}>Create New Workspace</button>
            </div>
          ) : (
            <div role="alert" className="alert alert-warning">
              <div className="flex md:items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <span className="text-left">You don't have any Workspace, Do you want to create one?</span>
              </div>
              <div className="ml-auto">
                <button className="btn btn-sm btn-neutral" onClick={() => document.getElementById('workspace_modal')!.showModal()}>Create</button>
              </div>
            </div>
          )
        }
        <WorkspaceList />
      </div>
      <dialog id="workspace_modal" className="modal modal-bottom md:modal-middle">
        <div className="modal-box w-full md:max-w-[900px]">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {
                form.tasks.map((_, idx: number) => (
                  <label key={idx} className="form-control w-full">
                    <input type="text" placeholder={`Task ${idx + 1} Title`} className={`input input-bordered w-full`}
                      value={form.tasks[idx]}
                      onChange={(e) => {
                        const cloneTasks = [...form.tasks];
                        cloneTasks[idx] = e.target.value;
                        setForm({ ...form, tasks: cloneTasks });
                      }}
                    />
                  </label>
                ))
              }
            </div>
            <button className="btn sm:ml-auto" onClick={handleAddRow}>
              <span>Add</span>
              <IoMdAdd className="text-xl" />
            </button>
            <div className="modal-action">
              <form method="dialog">
                <button onClick={handleCancel} className="btn btn-outline btn-error">Cancel</button>
                <button onClick={handleSubmit} className="btn btn-success ml-3">Create</button>
              </form>
            </div>
          </div>
        </div>
      </dialog>
      {
        toast === 'SUCCESS' ? (
          <div className="toast toast-center w-[95vw] md:w-[400px] md:toast-end">
            <div className="alert alert-success">
              <span>Your Workspace Created. Congrats!</span>
            </div>
          </div>
        ) : toast === 'ERROR' ? (
          <div className="toast toast-center w-[95vw] md:w-[400px] md:toast-end">
            <div className="alert alert-error">
              <span>Something Went Wrong Please Try Again Later.</span>
            </div>
          </div>
        ) : null
      }
    </>
  )
}
