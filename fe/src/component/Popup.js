export const Popup = ({ onClose, Content }) => {
    return <div onClick={onClose} className="w-full h-full fixed bg-black/20 !m-0 p-0 inset-0 z-30">
        <div className="flex justify-center items-center inset-0 h-full w-full">
            {/* {Content && <Content/>} */}
            <div className="rounded min-w-80 max-w-full bg-white" onClick={(e) => e.stopPropagation()}>
                <div className="border-b border-gray-300 flex flex-row justify-end">
                    <button onClick={onClose} type="button" className="m-2 rounded-full top-0 right-0 bg-red-500 text-white hover:bg-red-700 hover:text-white font-semibold text-nowrap flex items-center justify-center p-1 disabled:opacity-60 disabled:!bg-red-500">
                        <span className="material-icons text-md">close</span>
                    </button>
                </div>
                <div className="p-4">
                    {Content}
                </div>
            </div>
        </div>
    </div>
}