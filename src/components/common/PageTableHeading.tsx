import { useNavigate } from "react-router";


function PageTableHeading({title,buttonText,onClick,path}:{title:string,buttonText:string,onClick:()=>void,path:any}) {
 const navigate = useNavigate();
  return (
    <div className="w-full flex flex-row items-center justify-between mb-6">
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">{title}</h1>
     {!path&& <button onClick={onClick} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        {buttonText}
      </button>}
      {path&& <button onClick={()=>navigate(path)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        {buttonText}
      </button>}
    </div>
  )
}

export default PageTableHeading
