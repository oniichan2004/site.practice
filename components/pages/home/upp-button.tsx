'use client'

export default function Scroll (){

return (
    <div className=" flex items-center justify-center w-20 h-15 bg-blue-500 rounded-xl hover:bg-blue-700 fixed bottom-6 right-6">
<button    onClick={() => window.scrollTo ({top:0,behavior:'smooth'})}  > 
   Go Up
</button>


    </div>
)

}