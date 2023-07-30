import "./GPTLoadingIcon.css";

export default function GPTLoadingIcon({ size, center }) {
    return (
        <div className="GPTLoadingIcon" style={{
            width: `${size}px`,
            height: `${size}px`,
            borderWidth: `${size / 6}px`,
            borderTopWidth: `${size / 6}px`,
            margin: center ? "auto" : null
        }}></div>
    );
}