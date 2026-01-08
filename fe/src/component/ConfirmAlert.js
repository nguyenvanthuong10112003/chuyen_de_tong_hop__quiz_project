import { useState } from "react";

export const ConfirmAlertComp = ({
    iconUse, 
    iconType,
    title,
    label,
    onClose,
    onAccept,
    inputUse,
    inputType,
    inputOnChange,
    inputRequired
}) => {
    const [value, setValue] = useState('');
    const [error, setError] = useState();
    return <div>
        <div id="dialog" aria-labelledby="dialog-title" className="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent">
            <div className="fixed inset-0 bg-white/20 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></div>

            <div tabIndex="0" className="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95">
                    <div className="bg-white p-4">
                        <div className="sm:flex sm:items-start">
                            {iconUse && <div className="me-3 sm:me-4 mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-500/10 sm:mx-0 sm:size-10">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" data-slot="icon" aria-hidden="true" className="size-6 text-red-400">
                                    <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>}
                            <div className="text-center sm:mt-0 sm:text-left">
                                <h3 id="dialog-title" className="text-base font-semibold text-black">{title}</h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-400">{label}</p>
                                    {inputUse && <input value={value} className={`w-full mt-1 border rounded-lg p-2 px-4 ${error ? "!border-red-500" : ""} shadow-sm shadow-gray-50 focus:border-purple-500 border-1 focus:outline-none focus:shadow-purple-300`} type={inputType} onChange={(e) => {inputOnChange(e); setValue(e.target.value)}} />}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 flex sm:flex-row-reverse">
                        <button onClick={() => { setError(undefined); if (inputUse && inputRequired && !value?.trim()) {setError('invalid'); return;} onClose(); onAccept(); }} type="button" className="inline-flex w-full justify-center rounded-md bg-purple-500 px-3 py-2 text-sm font-semibold text-white hover:bg-purple-400 sm:ml-3 sm:w-auto">Đồng ý</button>
                        <button onClick={() => { onClose() }} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-gray-500 px-3 py-2 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-gray-400 sm:mt-0 sm:w-auto">Hủy bỏ</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}