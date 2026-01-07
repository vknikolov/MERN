import React, { useRef, useState, useEffect } from "react";

// Components
import Button from "../../form-elements/button/Button.js";

// CSS
import "./ImageUpload.css";

const ImageUpload = ({ id, center, onInput, errorText }) => {
  // State for the selected file, preview URL, and validity
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();

  // Generate preview URL when file changes
  useEffect(() => {
    // If no file is selected, do nothing
    if (!file) {
      return;
    }
    // Create a FileReader to read the file
    const fileReader = new FileReader();

    // When file is loaded, set the preview URL
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result); // Data URL
    };

    // Read the file as a data URL
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (event) => {
    // Check if a file is picked
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0]; // Get the picked file
      console.log(pickedFile);
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    onInput(id, pickedFile, fileIsValid);
  };

  // Handler to trigger file input click
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="form-control">
      <input
        id={id}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        ref={filePickerRef}
        onChange={pickedHandler}
      />
      <div className={`image-upload ${center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" />
          ) : (
            <p>Please pick an image.</p>
          )}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          Pick Image
        </Button>
      </div>

      {!isValid && <p>{errorText}</p>}
    </div>
  );
};

export default ImageUpload;
