import Pattern from '../assets/logobgstraightened.png';
import Wordmark from '../assets/wordmark.svg';

function Home() {

    return (
        <>
            <div className='fixed top-0 z-[50] w-screen h-screen bg-[auto_600px] bg-white/93 bg-blend-lighten font-lato' 
                style={{ backgroundImage: `url(${Pattern})` }}>
                <div className='flex justify-between px-10 pt-8 pb-3'>
                    <a href='/'><img className='max-w-[230px]' src={Wordmark} /></a>
                    <div className='grid grid-cols-2 gap-4 justify-center align-middle'>
                        <a href='signup'><button className='border border-fit-orange text-fit-orange my-1 px-6 py-2 rounded-full bg-white hover:bg-fit-orange hover:text-white font-lato text-sm'>Sign Up</button></a>
                        <a href='login'><button className='bg-fit-orange my-1 px-6 py-2 rounded-full text-white border border-fit-orange hover:bg-white hover:text-fit-orange font-lato text-sm'>Log In</button></a>
                    </div>
                </div>
                <div
                    className="flex flex-col gap-12 h-[80vh] items-center justify-center px-[30px] font-lato">
                    <h1 className='text-[#333333] text-center font-bold text-4xl md:text-5xl lg:text-6xl animate-floatIn'>Smarter, safer workouts. <br /> Personalized for you.</h1>
                    <h4 className='text-[#555555] text-center text-lg opacity-90 w-2/3 max-w-[780px] animate-floatInDelay'>Our AI-powered platform creates workout programs based on your individual needs. Our tailored routines are crafted for injury recovery and making you a fitter, healthier person.</h4>

                    <a href='signup'><button className='text-2xl font-bold px-8 py-3 bg-fit-orange text-white rounded-full border border-fit-orange hover:bg-white hover:text-fit-orange font-lato'>Get Started</button></a>
                </div>
            </div>
        </>
    )
}

export default Home;




