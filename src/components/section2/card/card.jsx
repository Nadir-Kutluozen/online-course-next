import React from 'react';
import styles from './Card.module.css'

const Card = ({ title, description,Icon  }) => {
    return (
        <div className={styles.cardCustom}>
            {Icon && <Icon size={50}  className="mb-3 text-primary" />}
            <div className={styles.cardContent}>
                <h3 className={styles.cardTit}>{title}</h3>
                <p className={styles.cardDesc}>{description}</p>
            </div>
        </div>
    );
};

export default Card;
