import React from 'react'

const ImageUpload = () => {
    return (
        <div>
            <h1>File Upload with Multer</h1>


            <form action="http://localhost:5050/upload" method="post" encType="multipart/form-data"
                onClick={() => {
                    console.log("file form forntend : ", file);
                }}
            >
                <input type="file" name="file" />
                <input type="submit" value="Upload" />
            </form>
        </div>
    )
}

export default ImageUpload
