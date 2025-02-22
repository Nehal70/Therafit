import { BiSend } from "react-icons/bi";
import ProgramBlock from "../components/programBlock";

function Dashboard() {

    return (
        <>
            <div className='flex flex-col max-w-[1100px] m-auto py-10 items-start'>
                <h1 className='font-bold text-4xl mb-3'>Hi, Jane!</h1>
                <h3 className='text-lg mb-3'>Let&rsquo;s continue your fitness journey.</h3>
                <h2 className='font-bold text-fit-black mb-3 mt-3 text-xl'>My Current Programs</h2>
                <div className='grid grid-cols-3 gap-4'>
                    <ProgramBlock title='Upper Body Workout' desc='Focused on upper body and ankle injury recovery' />
                    <ProgramBlock title='Upper Body Workout' desc='Focused on upper body and ankle injury recovery' />
                    <ProgramBlock title='' desc='' />
                </div>

                <h2 className='font-bold text-fit-black mt-6 mb-3 text-xl'>Past Workouts</h2>

            </div>
        </>

    )
}

export default Dashboard
