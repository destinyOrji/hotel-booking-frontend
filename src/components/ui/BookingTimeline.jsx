import './BookingTimeline.css'

const BookingTimeline = ({ steps, currentStep }) => {
  return (
    <div className="booking-timeline">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`timeline-step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
        >
          <div className="timeline-step-indicator">
            {index < currentStep ? (
              <span className="step-check">✓</span>
            ) : (
              <span className="step-number">{index + 1}</span>
            )}
          </div>
          <span className="timeline-step-label">{step.label}</span>
          {index < steps.length - 1 && <div className="timeline-connector" />}
        </div>
      ))}
    </div>
  )
}

export default BookingTimeline
