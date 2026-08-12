import React from 'react';
import skeletonStyles from './pokemon.detail.skeleton.module.css';

export const PokemonDetailSkeleton: React.FC = () => {
  return (
    <div>
      <div className={`${skeletonStyles.bone} ${skeletonStyles.titleBone}`} />

      <div className={skeletonStyles.spritesRow}>
        <div
          className={`${skeletonStyles.bone} ${skeletonStyles.spriteBone}`}
        />
        <div
          className={`${skeletonStyles.bone} ${skeletonStyles.spriteBone}`}
        />
        <div
          className={`${skeletonStyles.bone} ${skeletonStyles.spriteBone}`}
        />
        <div
          className={`${skeletonStyles.bone} ${skeletonStyles.spriteBone}`}
        />
      </div>

      <div className={skeletonStyles.tagsRow}>
        <div className={`${skeletonStyles.bone} ${skeletonStyles.tagBone}`} />
        <div className={`${skeletonStyles.bone} ${skeletonStyles.tagBone}`} />
      </div>

      <div className={`${skeletonStyles.bone} ${skeletonStyles.audioBone}`} />

      <div className={`${skeletonStyles.bone} ${skeletonStyles.textBone}`} />
      <div className={`${skeletonStyles.bone} ${skeletonStyles.textBone}`} />
      <div className={`${skeletonStyles.bone} ${skeletonStyles.textBone}`} />

      <div className={skeletonStyles.stats}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className={skeletonStyles.statBone}>
            <div
              className={`${skeletonStyles.bone} ${skeletonStyles.statLabelBone}`}
            />

            <div
              className={`${skeletonStyles.bone} ${skeletonStyles.statProgressBone}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokemonDetailSkeleton;
