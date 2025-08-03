import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";

function BusSchedule({ schedule }) {
	return (
		<div className='bg-white p-4 rounded-lg shadow-md mb-4'>
			<div className='flex justify-between items-center'>
				<div>
					<p className='text-lg font-semibold'>
						{format(new Date(schedule.departureTime), "h:mm a")}
					</p>
					<p className='text-sm text-neutral-500'>Departure</p>
				</div>
				<div className='flex-1 mx-4 border-t-2 border-dashed border-neutral-300'></div>
				<div>
					<p className='text-lg font-semibold'>
						{format(new Date(schedule.arrivalTime), "h:mm a")}
					</p>
					<p className='text-sm text-neutral-500'>Arrival</p>
				</div>
			</div>
			<div className='mt-4 flex justify-between items-center'>
				<div className='text-sm'>
					<span className='font-semibold'>Available Seats:</span>{" "}
					<span
						className={`${
							schedule.availableSeats > 5
								? "text-success-600"
								: "text-error-600"
						}`}
					>
						{schedule.availableSeats}
					</span>
				</div>
				<button
					className='bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors'
					onClick={() => {
						/* TODO: Implement booking logic */
					}}
				>
					Book Now
				</button>
			</div>
		</div>
	);
}

function BusResult({ bus }) {
	return (
		<div className='bg-neutral-50 rounded-xl shadow-lg p-6 mb-6'>
			<div className='border-b pb-4 mb-4'>
				<h3 className='text-xl font-bold text-neutral-800'>
					{bus.name || "Bus Service"}
				</h3>
				<p className='text-sm text-neutral-600'>Bus ID: {bus._id}</p>
			</div>

			{bus.schedules && bus.schedules.length > 0 ? (
				<div className='space-y-4'>
					{bus.schedules.map((schedule, index) => (
						<BusSchedule key={index} schedule={schedule} />
					))}
				</div>
			) : (
				<p className='text-center text-neutral-500 py-4'>
					No schedules available
				</p>
			)}
		</div>
	);
}
