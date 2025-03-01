import { Plus } from "lucide-react";
import Navbar from "../components/Navbar"
import { useImage } from "../store/ImageContext";
import ImageSourceDialog from "../components/ImageSourceDialog";
import WebRtcCamera from "../components/WebRTCCamera";
import { useState, useRef } from "react";
function UploadImage() {
    const { imagePreview, setImagePreview, imageFile, setImageFile } = useImage();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isWebRTCCamera, setIsWebRTCCamera] = useState(false);
    const fileInputRef = useRef(null);

    const handleSelectSource = (source) => {
        console.log("Selected:", source);
        setIsDialogOpen(false);
        if (source === 'camera') {
            setIsWebRTCCamera(true);
        } else if (source === 'gallery') {
            fileInputRef.current.click();
        }
    };
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
          setImageFile(file);          
          setImagePreview(URL.createObjectURL(file));
        }
    };
    const dataURItoBlob = (dataURI) => {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    }
    const handleWebRTCImageCapture = (imageData) => {
        const selectedImage = dataURItoBlob(imageData)
        setImagePreview(imageData);
        setIsWebRTCCamera(false);
        setImageFile(selectedImage);
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="w-full h-full flex-1 flex items-center justify-center">
                {imagePreview ? (
                    <div>
                        <img src={imagePreview} alt="Uploaded" />
                    </div>
                ) : (
                    <div onClick={() => setIsDialogOpen(true)} className="w-30 h-30 cursor-pointer border border-black rounded-lg flex justify-center items-center">
                        <Plus className="w-8 h-8" />
                    </div>
                    
                )}
                <ImageSourceDialog
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    onSelectSource={handleSelectSource}
                />    
                {isWebRTCCamera && (
      
                    <WebRtcCamera 
                        onClose={() => setIsWebRTCCamera(false)}
                        onImageConfirmed={handleWebRTCImageCapture}

                    />
                )} 
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                />     

            </div>
        </div>
    )
}
export default UploadImage