import { BiSend } from "react-icons/bi";
import ProgramBlock from "../components/programBlock";

function Dashboard() {

    return (
        <>
            <div className='flex flex-col max-w-[1100px] m-auto py-10 items-start'>
                <h1 className='font-bold text-4xl mb-3'>Hi, Jane!</h1>
                <h3 className='text-lg mb-3'>Let&rsquo;s continue your fitness journey.</h3>
                <h2 className='font-bold text-fit-black'>My Current Programs</h2>
                <div className='grid grid-cols-3 gap-4'>
                    <ProgramBlock title='Upper Body Workout' desc='Focused on upper body and ankle injury recovery' />
                </div>

                <p className='text-[#9a9796] mb-5'><em>e.g., "I have a sprained ankle (moderate pain), and I want to focus on upper body strength today. I’d like to avoid any weight-bearing exercises on my injured foot, so no standing exercises or anything that puts pressure on my ankle."</em></p>
                <textarea className='w-full bg-[#F6F5F5] rounded-md p-3 h-[200px] mb-3' placeholder='Start typing here...'></textarea>
                <a href='dashboard' className='self-end'>
                    <button className='flex text-white justify-center items-center font-semibold bg-fit-orange rounded-[100px] px-6 py-2'>Create Workout &nbsp;<BiSend size={28} /></button>
                </a>

            </div>
        </>

    )
}

export default Dashboard
