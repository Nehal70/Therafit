import ProgramIcon from '../assets/program_icon.svg';

function ProgramBlock({title, desc}) {

    return (
        <>
            <div className='bg-[#F6F5F5] rounded-md p-6 w-full'>
                <img src={ProgramIcon}/>
                <h1 className='font-bold'>{title}</h1>
                <p>{desc}</p>
            </div>
        </>

    )
}

export default ProgramBlock
