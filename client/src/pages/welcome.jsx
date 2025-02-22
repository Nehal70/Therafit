import { BiSend } from "react-icons/bi";

function Welcome() {

    return (
        <>
            <div className='flex flex-col max-w-[1100px] m-auto py-10 items-start'>
                <h1 className='font-bold text-4xl mb-3'>Hi, Jane!</h1>
                <h3 className='text-lg mb-3'>Let&rsquo;s create a workout that supports your recovery and goals!</h3>
                <p className='mb-2'>To get started, tell me:</p>
                <p className='mb-3'>
                    ✅ What injury (or injuries) are you currently dealing with?<br />
                    ✅ How severe is it? (Mild discomfort, moderate pain, or severe?)<br />
                    ✅ What&rsquo;s your goal today? (Strength, mobility, flexibility, pain relief, etc.)<br />
                    ✅ Any movements or exercises you know you need to avoid?
                </p>
                <p className='text-[#9a9796] mb-5'><em>e.g., "I have a sprained ankle (moderate pain), and I want to focus on upper body strength today. I’d like to avoid any weight-bearing exercises on my injured foot, so no standing exercises or anything that puts pressure on my ankle."</em></p>
                <textarea className='w-full bg-[#F6F5F5] rounded-md p-3 h-[200px] mb-3' placeholder='Start typing here...'></textarea>
                <a href='dashboard' className='self-end'>
                    <button className='flex text-white justify-center items-center font-semibold bg-fit-orange rounded-[100px] px-6 py-2'>Create Workout &nbsp;<BiSend size={28} /></button>
                </a>

            </div>
        </>

    )
}

export default Welcome
