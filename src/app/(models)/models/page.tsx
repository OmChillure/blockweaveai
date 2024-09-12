import Left from "@/components/models/left-wrapper";
import Models from "@/components/models/right";

export default function page() {
    return(
        <div className="min-h-[90vh] grid grid-cols-12 grid-rows-1 place-content-center">
            <Left/>
            <Models />
        </div>
    )
}