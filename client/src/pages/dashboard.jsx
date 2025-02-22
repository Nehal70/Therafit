import { PiHandWaving } from "react-icons/pi";
import ProgramBlock from "../components/programBlock";

function Dashboard() {

    // Fake JSON data
    const workoutData = [
        {
            "date": "2/19/2025",
            "workoutName": "Upper Body Workout",
            "duration": "1 hour"
        },
        {
            "date": "2/20/2025",
            "workoutName": "Arm Workout",
            "duration": "30 minutes"
        },
        {
            "date": "2/22/2025",
            "workoutName": "Lower Body Workout",
            "duration": "45 minutes"
        }
    ];

    return (
        <>
            <div className='flex flex-col max-w-[1100px] m-auto py-10 items-start'>
                <h1 className='flex items-center justify-center font-bold text-4xl mb-3 text-fit-black'>Hi, Jane!&nbsp;<PiHandWaving /></h1>
                <h3 className='text-lg mb-3 text-fit-gray'>Let&rsquo;s continue your fitness journey.</h3>
                <h2 className='font-bold text-fit-black mb-3 mt-3 text-xl'>My Current Programs</h2>
                <div className='grid grid-cols-3 gap-4'>
                    <ProgramBlock title='Upper Body Workout' desc='Focused on upper body and ankle injury recovery' />
                    <ProgramBlock title='Lower Body Workout' desc='Focused on lower body and shoulder injury recovery' />
                    <ProgramBlock title='' desc='' />
                </div>

                <h2 className='font-bold text-fit-black mt-6 mb-3 text-xl'>Past Workouts</h2>
                <div className='border rounded-lg border-gray-300 text-left w-full p-3'>
                    <table className='rounded-lg text-left w-full'>
                        <thead>
                            <tr className='border-b border-gray-400'>
                                <th className='p-3'>Date</th>
                                <th className='p-3'>Workout Name</th>
                                <th className='p-3'>Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workoutData.map((workout, index) => (
                                <tr key={index}>
                                    <td className='p-3'>{workout.date}</td>
                                    <td className='p-3'>{workout.workoutName}</td>
                                    <td className='p-3'>{workout.duration}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>
        </>

    )
}

export default Dashboard
