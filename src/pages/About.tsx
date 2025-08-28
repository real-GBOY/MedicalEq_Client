/** @format */

import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Ceo from "../components/Ceo";
import WhyChooseUs from "../components/WhyChooseUs";
import SectionDivider from "../components/SectionDivider";

const About: React.FC = () => {
	return (
		<div className='min-h-screen bg-white'>
			<Header />
			<section className='relative bg-[#00796a] text-white py-20'>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
					<h1 className='text-4xl sm:text-5xl font-bold mb-6'>About Us</h1>
					<p className='max-w-3xl text-teal-100 text-lg'>
						We are dedicated to delivering advanced, reliable medical equipment and
						integrated solutions that empower clinicians and improve patient outcomes.
						Our commitment to quality, safety, and innovation drives everything we do.
					</p>
				</div>
			</section>

			{/* CEO section from Home */}
			<Ceo />

			{/* Feature/value section from Home */}
			<SectionDivider variant='curve-down' color='#134e4a' height={60} />
			<WhyChooseUs />

			<section className='py-16'>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8'>
					<div className='p-6 rounded-2xl border border-teal-100 bg-teal-50'>
						<h3 className='text-[#0f172a] font-semibold text-xl mb-2'>Mission</h3>
						<p className='text-slate-600'>
							Delivering state-of-the-art medical devices with uncompromising quality and
							support.
						</p>
					</div>
					<div className='p-6 rounded-2xl border border-teal-100 bg-teal-50'>
						<h3 className='text-[#0f172a] font-semibold text-xl mb-2'>Vision</h3>
						<p className='text-slate-600'>
							Empowering healthcare systems through innovation and accessible technology.
						</p>
					</div>
					<div className='p-6 rounded-2xl border border-teal-100 bg-teal-50'>
						<h3 className='text-[#0f172a] font-semibold text-xl mb-2'>Values</h3>
						<p className='text-slate-600'>
							Integrity, safety, collaboration, and continuous improvement.
						</p>
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
};

export default About;
