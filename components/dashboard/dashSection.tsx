import Heading from '@/components/heading'
import ExpansionButton from '@/components/buttons/expansionButton'
import { useState } from 'react'

const DashSection = ({ children, heading = 'section' }) => {
	const [open, setOpenState] = useState(true)
	function toggleExpand(e) {
		setOpenState(!open)
	}

	const head = (
		<div className='flex flex-row'>
			<Heading level={2}>{heading}</Heading>
			<ExpansionButton expanded={open} fn={toggleExpand} />
		</div>
	)
	if (!open) {
		return head
	}

	return (
		<section>
			{head}
			{children}
		</section>
	)
}

export default DashSection
