export default function CustomerImagePlaceholder({ name }: { name: string }) {
    return (
        <div className="rounded-full w-[28px] h-[28px] bg-orange-400 text-black text-xl flex items-center justify-items-center">
            <div className="items-center m-auto">
                {name === "" ? "" : name[0].toUpperCase()} 
            </div>
        </div>
    )
}