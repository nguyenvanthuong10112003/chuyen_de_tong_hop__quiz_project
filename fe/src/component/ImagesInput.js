import { useRef } from "react";
import { toast } from "react-toastify";
import { upload } from "../service/PhotoService";

export const ImagesInput = ({ obj, setObj }) => {
    const imageRef = useRef();
    const handleClickOpenExplorer = () => {
        imageRef.current.click();
    };
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length === 0) return;

        if (selectedFiles.length > 6) {
            toast.error(`Số file được tải lên tối đa là 6!`);
            return;
        }

        // Kiểm tra có file nào KHÔNG phải ảnh
        const hasInvalidFile = selectedFiles.some(file => !file.type.startsWith("image/"));

        if (hasInvalidFile) {
            toast.error("Có file không phải ảnh!");
            return;
        }

        upload(selectedFiles)
            .then(response => {
                const data = response.data.data;
                console.log(data);
                setObj({...obj, photos: data });
            })
            .catch(error => {

            })
    };
    const handlerDelImg = (index) => {
        let photos = obj.photos?.filter((_, i) => i !== index) ?? []
        setObj({ ...obj, photos: photos })
    }
    return <div>
        <button onClick={handleClickOpenExplorer} type="button" className="my-1 border-purple-500 border text-purple-500 px-2 py-2 rounded hover:bg-purple-500 hover:text-white font-semibold text-nowrap">
            Tải lên ảnh
        </button>
        <input
            type="file"
            name="avatar"
            accept="image/*"
            ref={imageRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
        />
        {obj.photos && <div className="my-1 flex flex-row flex-wrap max-h-80 overflow-y-auto justify-center">
            {obj.photos.map((item, index) =>
                <div className="w-80 m-1 relative" key={index}>
                    <img className="w-full h-full" src={item.url} alt="" />
                    <button onClick={() => { handlerDelImg(index) }} type="button" className="absolute top-0 right-0 bg-red-500 text-white rounded hover:bg-red-700 hover:text-white font-semibold text-nowrap flex items-center justify-center p-1 disabled:opacity-60 disabled:!bg-red-500">
                        <span className="material-icons text-md">close</span>
                    </button>
                </div>)}
        </div>}
    </div>
}