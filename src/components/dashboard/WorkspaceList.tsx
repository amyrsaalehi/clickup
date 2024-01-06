import { TbProgressCheck } from "react-icons/tb";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { CiMail } from "react-icons/ci";
import { FaRegUserCircle } from "react-icons/fa";
import { api } from "~/utils/api";
import { EMAIL_REGEX } from "~/utils/regex";

const initForm = {
	email: '',
	progress: 0
};

const initToast = {
	type: null,
	message: ''
};

export default function WorkspaceList() {
	const [form, setForm] = useState(initForm);
	const [selectedTask, setSelectedTask] = useState({ id: 0, title: '', });
	const [toast, setToast] = useState<{ type: null | 'ERROR' | 'SUCCESS'; message: string }>(initToast);
	const me = api.user.me.useQuery({ token: Cookies.get('token')! });
	const workspacesQuery = api.workspace.getAll.useQuery();
	const searchUsers = api.user.search.useQuery({ email: form.email }, { enabled: false });
	const updateTask = api.task.updateTask.useMutation({
		onSuccess: () => {
			void workspacesQuery.refetch();
			setToast({ type: 'SUCCESS', message: 'Invitation Sent!' });
			setTimeout(() => setToast(initToast), 1000);
		},
		onError: () => {
			setToast({ type: 'ERROR', message: 'User not Found!' });
			setTimeout(() => setToast(initToast), 1000);
		}
	});
	const updateProgress = api.task.updateProgress.useMutation({
		onSuccess: () => {
			void workspacesQuery.refetch();
			setToast({ type: 'SUCCESS', message: 'Progress Updated!' });
			setTimeout(() => setToast(initToast), 1000);
		},
		onError: () => {
			setToast({ type: 'ERROR', message: 'Something Went Wrong Please Try Again Later!' });
			setTimeout(() => setToast(initToast), 1000);
		}
	});

	const handleCancel = () => {
		setForm(initForm);
	};

	const handleSubmitInvite = () => {
		if (!EMAIL_REGEX.test(form.email)) {
			setToast({ type: 'ERROR', message: 'Email is not Valid!' });
			setTimeout(() => setToast(initToast), 1000);
			return;
		}
		void searchUsers.refetch().then((data) => {
			if (!data.data?.length) {
				setToast({ type: 'ERROR', message: 'User not Found!' });
				setTimeout(() => setToast(initToast), 1000);
				return;
			}
			if (data.data[0]?.id === me.data?.id) {
				setToast({ type: 'ERROR', message: 'You Cannot Assign Task to Yourself!' });
				setTimeout(() => setToast(initToast), 1000);
				return;
			}
			updateTask.mutate({
				id: selectedTask.id,
				assigneeId: data.data[0]!.id
			})
			handleCancel();
		});
	};

	const handleSubmitProgress = () => {
		updateProgress.mutate({
			id: selectedTask.id,
			progress: form.progress
		})
		handleCancel();
	};

	return workspacesQuery.data?.map((workspace) => {
		const isMyWorkspace = workspace.userId === me.data?.id;
		const doIHaveATask = workspace.tasks.some((task) => task.assignee?.id === me.data?.id);
		const shouldShowToMe = isMyWorkspace || doIHaveATask;
		if (!shouldShowToMe) return null;
		return (
			<>
				<div key={workspace.id} className="join join-vertical w-full">
					<div className="collapse collapse-arrow join-item border border-base-300">
						<input type="radio" name="my-accordion-4" />
						<div className="collapse-title text-xl font-medium">
							<span>
								{workspace.title}
							</span>
							<span className="ml-1 text-sm font-light">
								{isMyWorkspace ? '(Your Workspace)' : ''}
							</span>
						</div>
						<div className="collapse-content py-4">
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center gap-5">
								{
									workspace.tasks?.map((task) => {
										console.log(task.assignee);
										return (
											<ul key={task.id} className="list-disc px-4">
												<li>
													<div className="flex gap-3 flex-col pb-4 md:pb-0">
														<div className="flex flex-col gap-2">
															<div className="flex flex-col gap-1">
																<div className="flex gap-1 items-center">
																	<h4 className="text-xl font-bold">{task.title}</h4>
																	<span className={`text-sm ${task.progress > 75 ? 'text-success' : task.progress < 75 && task.progress >= 50 ? 'text-warning' : 'text-error'}`}>({task.progress}%)</span>
																</div>
																<p className="opacity-65 text-xs">
																	Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, maxime officia? Molestiae ab aspernatur odio dicta omnis, consequatur suscipit earum repudiandae, sapiente nulla, tempora fuga provident voluptas iusto quo eos?
																</p>
															</div>
															{
																!task.assignee?.id && isMyWorkspace ? (
																	<>
																		<div className="flex gap-1 items-center">
																			<FaRegUserCircle />
																			<span>-</span>
																		</div>
																		<button className="btn btn-sm" onClick={() => {
																			setSelectedTask(task);
																			document.getElementById('assign_modal')!.showModal()
																		}}>
																			<span>Assign</span>
																			<FaRegUserCircle />
																		</button>
																	</>
																) :
																	isMyWorkspace && task.assignee?.id && (task.assignee?.id !== me.data?.id) ? (
																		<>
																			<div className="flex gap-1 items-center">
																				<FaRegUserCircle />
																				<a href={`mailto:${task.assignee?.email}?cc=${me.data?.email}&subject=${task.title}&body="Please Contact Me For this task."`}>{task.assignee.fullName}</a>
																			</div>
																			<button className="btn btn-sm" disabled onClick={() => {
																				setSelectedTask(task);
																				document.getElementById('assign_modal')!.showModal()
																			}}>
																				<span>Waiting For Change Progress</span>
																			</button>
																		</>
																	) :
																		!isMyWorkspace && task.assignee?.id && (task.assignee?.id === me.data?.id) ? (
																			<div className="flex flex-col gap-2">
																				<div className="flex items-center gap-1">
																					<FaRegUserCircle />
																					<span>Me</span>
																				</div>
																				<button className="btn btn-sm" onClick={() => {
																					setSelectedTask(task);
																					document.getElementById('progress_modal')!.showModal()
																				}}>
																					<span>Change Progress</span>
																					<TbProgressCheck />
																				</button>
																			</div>
																		) : (
																			<>
																				<div className="flex gap-1 items-center">
																					<FaRegUserCircle />
																					<span>-</span>
																				</div>
																				<button className="btn btn-sm" disabled onClick={() => {
																					setSelectedTask(task);
																					document.getElementById('assign_modal')!.showModal()
																				}}>
																					<span>Waiting For Assignment</span>
																				</button>
																			</>
																		)
															}
															<progress
																className={`progress min-w-56 w-full ${task.progress > 75 ? 'progress-success' : task.progress < 75 && task.progress >= 50 ? 'progress-warning' : 'progress-error'}`}
																value={task.progress} max="100"
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
				<dialog id="assign_modal" className="modal modal-bottom md:modal-middle">
					<div className="modal-box w-full md:max-w-[500px]">
						<div className="flex flex-col gap-5">
							<h3 className="font-bold text-lg">{selectedTask.title} Assignment</h3>
							<label className="form-control w-full">
								<input type="email" placeholder="Assignee's Email" className={`input input-bordered w-full`}
									value={form.email}
									onChange={(e) => {
										setForm({ ...form, email: e.target.value });
									}}
								/>
							</label>
							<div className="modal-action">
								<form method="dialog">
									<button onClick={handleCancel} className="btn btn-outline btn-error">Cancel</button>
									<button onClick={handleSubmitInvite} className="btn btn-success ml-3">Invite</button>
								</form>
							</div>
						</div>
					</div>
				</dialog>
				<dialog id="progress_modal" className="modal modal-bottom md:modal-middle">
					<div className="modal-box w-full md:max-w-[500px]">
						<div className="flex flex-col gap-5">
							<h3 className="font-bold text-lg">{selectedTask.title} Change Progress</h3>
							<label className="form-control w-full">
								<input type="number" placeholder="Progress" className={`input input-bordered w-full`}
									value={form.progress}
									onChange={(e) => {
										setForm({ ...form, progress: e.target.valueAsNumber });
									}}
								/>
							</label>
							<div className="modal-action">
								<form method="dialog">
									<button onClick={handleCancel} className="btn btn-outline btn-error">Cancel</button>
									<button onClick={handleSubmitProgress} className="btn btn-success ml-3">Change</button>
								</form>
							</div>
						</div>
					</div>
				</dialog>
				{
					toast.type === 'SUCCESS' ? (
						<div className="toast toast-center w-[95vw] md:w-[400px] md:toast-end">
							<div className="alert alert-success">
								<span>{toast.message}</span>
							</div>
						</div>
					) : toast.type === 'ERROR' ? (
						<div className="toast toast-center w-[95vw] md:w-[400px] md:toast-end">
							<div className="alert alert-error">
								<span>{toast.message}</span>
							</div>
						</div>
					) : null
				}
			</>
		);
	})

}