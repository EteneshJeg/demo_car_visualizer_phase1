import { createContext, useContext, useState } from "react";

const ImageContext = createContext();

export const ImageProvider = ({children}) => {
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    return (
        <ImageContext.Provider value={{imagePreview, setImagePreview, imageFile, setImageFile}}>
            {children}
        </ImageContext.Provider>
    );
}

export const useImage = () => useContext(ImageContext);