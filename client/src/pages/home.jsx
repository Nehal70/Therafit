import Pattern from '../assets/pattern.webp';
import Wordmark from '../assets/wordmark.svg';

function Home() {

    return (
        <>
            <div className='fixed top-0 z-[50] w-screen h-screen  bg-[auto_600px] bg-white/70 bg-blend-lighten'
                style={{ backgroundImage: `url(${Pattern})` }}>
                <div className='flex justify-between px-10 pt-8 pb-3'>
                    <a href='/'><img className='max-w-[180px]' src={Wordmark} /></a>
                    <div className='grid grid-cols-2 gap-4 justify-center align-middle'>
                        <button className='border border-[#1E1E1E] text-[#1E1E1E] my-1 px-8 py-2 rounded-[100px] bg-white'>Sign Up</button>
                        <a href=''><button className='bg-fit-orange my-1 px-8 py-2 rounded-[100px]'>Log In</button></a>
                    </div>
                </div>
                <div
                    className="flex flex-col gap-12 h-[80vh] items-center justify-center px-[30px]">
                    <h1 className='text-fit-black text-center font-bold text-6xl'>Smarter, safer workouts. <br /> Personalized for you.</h1>
                    <h4 className='text-fit-gray text-center text-xl w-2/3 max-w-[780px]'>Our AI-powered platform creates workout programs based on your individual needs. Our tailored routines are crafted for injury recovery and making you a fitter, healthier person.</h4>

                    <a href='login'><button className='text-2xl font-bold px-13 py-4 bg-fit-orange text-white rounded-[100px]'>Get Started</button></a>
                </div>
            </div>

        </>

    )
}

export default Home
