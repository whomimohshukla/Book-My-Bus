import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import { FaTimes, FaCouch, FaCheck, FaMale, FaFemale } from "react-icons/fa";

// Quick seat grid generator based on capacity (defaults to 32)
const defaultSeatLayout = () => {
	const seats = [];
	for (let r = 1; r <= 8; r++) {
		for (let c = 1; c <= 4; c++) {
			const num = (r - 1) * 4 + c;
			seats.push({ id: num, status: "available" });
		}
	}
	return seats;
};

const SeatDrawer = ({ open, onClose, bus }) => {
	const navigate = useNavigate();
	const [seats, setSeats] = useState([]);
	const [selected, setSelected] = useState([]);

	useEffect(() => {
		const fetchSeatMap = async () => {
			try {
				const layout = defaultSeatLayout();
				const res = await axiosInstance.get(
					`/api/scheduleRoutes/schedule/${bus._id}/seats`
				);
				// // console.log("seat map", res.data);

				res.data.forEach(({ seat, status }) => {
					const seatObj = layout.find((s) => s.id === parseInt(seat));
					if (seatObj) {
						if (status === "bookedMale" || status === "bookedFemale") {
                            seatObj.status = status; // preserve gender
                        } else {
                            seatObj.status = "available";
                        }
					}
				});
				setSeats(layout);
			} catch (err) {
				console.error("Seat map fetch failed", err);
				setSeats(defaultSeatLayout());
			} finally {
				setSelected([]);
			}
		};

		if (open && bus?._id) {
			fetchSeatMap();
		}
	}, [open, bus]);

	if (!bus) return null;

	const toggleSeat = (seatId) => {
		const seatObj = seats.find((s) => s.id === seatId);
		if (!seatObj || seatObj.status === "booked") return;

		setSelected((prev) =>
			prev.includes(seatId)
				? prev.filter((id) => id !== seatId)
				: [...prev, seatId]
		);
	};

	// Build seats with aisle spacer after every 2nd seat to mimic RedBus layout
    const seatsWithAisle = [];
    seats.forEach((s, idx) => {
        // push seat
        seatsWithAisle.push(s);
        // insert spacer after 2 seats
        if ((idx + 1) % 4 === 2) {
            seatsWithAisle.push({ spacer: true, id: `spacer-${idx}` });
        }
    });

    const mappedSeats = seatsWithAisle.map((seat) => {
        if (seat.spacer) {
            return <div key={seat.id} className="w-4 h-8" />; // aisle gap
        }
		const isSelected = selected.includes(seat.id);
		const baseCls =
			"w-8 h-8 flex items-center justify-center text-xs font-medium rounded m-1";
		let statusCls = "";
        switch (seat.status) {
            case "bookedMale":
                statusCls = "bg-[#4B4B4B] cursor-not-allowed text-white";
                break;
            case "bookedFemale":
                statusCls = "bg-[#F0608F] cursor-not-allowed text-white";
                break;
            default:
                statusCls = isSelected
                    ? "bg-Darkgreen text-white"
                    : "bg-gray-200 hover:bg-LightGreen";
        }
		return (
            <button
				key={seat.id}
				disabled={seat.status === "booked"}
				onClick={() => toggleSeat(seat.id)}
				className={`${baseCls} ${statusCls}`}
			>
                {seat.status === "bookedMale" ? <FaMale className="text-white" /> : seat.status === "bookedFemale" ? <FaFemale className="text-white" /> : seat.id}
			</button>
		);
	});

	const totalFare =
		(bus.fareDetails?.baseFare || 0) +
		(bus.fareDetails?.tax || 0) +
		(bus.fareDetails?.serviceFee || 0);
	const payable = totalFare * selected.length;

	return (
		<Dialog open={open} onClose={onClose} className='fixed inset-0 z-40 flex'>
			{/* overlay */}
			<div className='fixed inset-0 bg-black/30' aria-hidden='true' />

			{/* panel */}
			<div className='relative ml-auto w-full max-w-md bg-white rounded-l-2xl flex flex-col shadow-2xl mt-20 sm:mt-24'>
				{/* header */}
				<div className='flex justify-between items-center p-4 border-b border-gray-200'>
					<div>
						<h3 className='font-semibold text-lg text-gray-900'>
							{bus.busName || bus.busId?.busName}
						</h3>
						<p className='text-sm text-gray-500'>Select your seats</p>
					</div>
					<button
						onClick={onClose}
						className='text-gray-500 hover:text-gray-700'
					>
						<FaTimes />
					</button>
				</div>

				{/* seat grid */}
				<div className='p-4 flex-1 overflow-y-auto'>
					{/* Driver */}
                    <div className='mb-4 flex justify-center'>
                        <FaCouch className='text-4xl text-gray-400 rotate-90' />
                    </div>
                    <div className='grid grid-cols-5 justify-items-center'>
						{mappedSeats}
					</div>

					{/* legend */}
                    <div className='mt-6 grid grid-cols-2 gap-4 text-sm'>
                        <div className='flex items-center'>
                            <span className='w-4 h-4 bg-gray-200 rounded mr-1' /> Available
                        </div>
                        <div className='flex items-center'>
                            <FaMale className='text-[#4B4B4B] mr-1' /> Booked (Male)
                        </div>
                        <div className='flex items-center'>
                            <FaFemale className='text-[#F0608F] mr-1' /> Booked (Female)
                        </div>
                        <div className='flex items-center'>
                            <span className='w-4 h-4 bg-Darkgreen rounded mr-1' /> Selected
                        </div>
                    </div>
				</div>

				{/* footer */}
				<div className='p-4 border-t border-gray-200'>
					<div className='flex justify-between items-center mb-3 text-sm text-gray-700'>
						<span>{selected.length} seat(s) selected</span>
						<span>₹{payable}</span>
					</div>
					<button
						disabled={!selected.length}
						onClick={() =>
							navigate("/booking", { state: { bus, seats: selected } })
						}
						className='w-full bg-Darkgreen disabled:bg-gray-400 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition'
					>
						<FaCheck /> Continue to Book
					</button>
				</div>
			</div>
		</Dialog>
	);
};

export default SeatDrawer;
