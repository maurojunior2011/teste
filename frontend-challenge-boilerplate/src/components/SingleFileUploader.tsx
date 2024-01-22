import { FileActionType } from "@/constants/context";
import { FileProvider, useFileContext } from "@/context";
import { ChangeEvent } from "react";

const SingleFileUploader = () => {
  //const { state: { file } } = useFileContext();
  const context = useFileContext();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Do not use useState to control this file change. Instead, use the FileContext
    e.preventDefault();
    const files = Array.from(e.target.files);
    console.log(files[0].name);
    context.dispatch( { type: FileActionType.SET_UPLOAD_FILE, payload: { file: files[0] } } );
  };

  const handleUpload = async () => {
    // Do your upload logic here. Remember to use the FileContext  
    console.log("upload");
    
    var data = new FormData()
    if(context.state.file != null)
      data.append('file', context.state.file);
    else
      return;

    fetch('http://127.0.0.1:8001/api/debits', { // Your POST endpoint
    method: 'POST',
    headers: {
    // //   // Content-Type may need to be completely **omitted**
    // //   // or you may need something
    // //   "Content-Type": "You will perhaps need to define a content-type here"
       "Access-Control-Allow-Origin": "*"
    },
    body: data // This is your file object
  }).then( // Handle the success response object
    response => response.json() // if the response is a JSON object
    ).then(
      success =>  {
        context.dispatch( { type: FileActionType.SET_FILE_LIST, payload: undefined });
        alert("Dados Enviados!");
      }
        
  ).catch(
    error => console.log(error) // Handle the error response object
  );
  };

  return (
    <div className = "flex flex-col gap-6">
      <div>
        <label htmlFor="file" className="sr-only">
          Choose a file
        </label>
        <input id="file" type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv" onChange={handleFileChange} />
      </div>
      {context.state.file && (
        <section>
          <p className="pb-6">File details:</p>
          <ul>
            <li>Name: {context.state.file.name}</li>
            <li>Type: {context.state.file.type}</li>
            <li>Size: {context.state.file.size} bytes</li>
          </ul>
        </section>
      )}

      {context.state.file && <button className="rounded-lg bg-green-800 text-white px-4 py-2 border-none font-semibold" onClick={handleUpload}>Upload the file</button>}
    </div>
  );
};

export { SingleFileUploader };
  

