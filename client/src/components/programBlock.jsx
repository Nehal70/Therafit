import ProgramIcon from '../assets/program_icon.svg';
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

function ProgramBlock({ title, desc }) {

    const navigate = useNavigate();
    
        const handleNew = (e) => {
                navigate("/chat");
        };

    // Check if title is an empty string
    if (title === "") {
        return (
            <div onClick={handleNew} className='cursor-pointer text-[#737373] hover:text-[#615e5e] border-dashed border-4 gap-4 rounded-lg border-[#ADADAD] hover:border-[#615e5e] p-6 w-full items-center flex justify-center flex-col'>
                <h1 className=''><FaPlus size={90}/></h1>

                <div>
                    <h1 className='font-bold text-center text-lg'>Add new workout program</h1>
                    <p className='text-center'>{desc}</p>
                </div>
            </div>
        );
    }

    return (
        <div className='bg-[#F6F5F5] gap-4 rounded-lg p-6 w-full items-center flex justify-center flex-col'>
            <img className='max-w-[100px]' src={ProgramIcon} />
            <div>
                <h1 className='font-bold text-center'>{title}</h1>
                <p className='text-center'>{desc}</p>
            </div>

            <button className='bg-fit-orange px-5 py-2 rounded-[100px] text-white font-semibold hover:bg-fit-orange-hover hover:text-fit-white-hover'>Continue Program</button>
        </div>
    )
}

export default ProgramBlock;
