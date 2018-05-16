/*
 * Copyright 2015-2018 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @exports TileMatrix
 */
define([
        '../error/ArgumentError',
        '../util/Logger',
        '../geom/Sector'
    ],
    function (ArgumentError,
              Logger,
              Sector) {
        "use strict";

        /**
         * TileMatrix is a collection of tiles for a fixed resolution (degrees per pixel). It contains the dimensions of
         * the tile in pixels and the dimension of the matrix in tiles.
         * @param sector the geographic coverage of this TileMatrix
         * @param ordinal the index of this TileMatrix in the TileMatrixSet
         * @param matrixWidth the number of tiles in the x direction
         * @param matrixHeight the number of tiles in the y direction
         * @param tileWidth the number of pixels or points in the x direction
         * @param tileHeight the number of pixels or points in the y direction
         * @constructor
         */
        var TileMatrix = function (sector, ordinal, matrixWidth, matrixHeight, tileWidth, tileHeight) {
            if (!sector) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TileMatrix", "constructor",
                        "missingSector"));
            }

            if (ordinal < 0) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TileMatrix", "constructor",
                        "The specified oridinal is null or undefined."));
            }

            if (matrixWidth < 1) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TileMatrix", "constructor",
                        "invalidWidth"));
            }

            if (matrixHeight < 1) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TileMatrix", "constructor",
                        "invalidHeight"));
            }

            if (tileWidth < 1) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TileMatrix", "constructor",
                        "invalidWidth"));
            }

            if (tileHeight < 1) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TileMatrix", "constructor",
                        "invalidHeight"));
            }

            /**
             * The geographic coverage area of this TileMatrix.
             */
            this.sector = sector;

            /**
             * The index position of this TileMatrix in the TileMatrixSet.
             */
            this.ordinal = ordinal;

            /**
             * The number of pixels or points of tiles in the horizontal or x direction.
             */
            this.tileWidth = tileWidth;

            /**
             * The number of pixels or points of tiles in the vertical or y direction.
             */
            this.tileHeight = tileHeight;

            /**
             * The number of tiles in the horizontal or x direction.
             */
            this.matrixWidth = matrixWidth;

            /**
             * The number of tiles in the vertical or y direction.
             */
            this.matrixHeight = matrixHeight;
        };

        /**
         * Calculate the resolution of this TileMatrix in degrees per pixel
         * @returns {number} degress per pixel resolution
         */
        TileMatrix.prototype.degreesPerPixel = function () {
            return this.sector.deltaLatitude() / (this.matrixHeight * this.tileHeight);
        };

        /**
         * Returns the geographic representation of a tile at the provided row and column.
         * @param row the row of the TileMatrix
         * @param column the column of the TileMatrix
         * @returns {Sector} a Sector representing the geographic coverage of the row and column in this TileMatrix
         */
        TileMatrix.prototype.tileSector = function (row, column) {
            if (row < 0 || row >= this.matrixHeight) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TileMatrix", "tileSector",
                        "invalidRod"));
            }

            if (column < 0 || column >= this.matrixWidth) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TileMatrix", "tileSector",
                        "invalidColumn"));
            }

            var deltaLat = this.sector.deltaLatitude() / this.matrixHeight;
            var deltaLon = this.sector.deltaLongitude() / this.matrixWidth;
            var minLat = this.sector.maxLatitude - deltaLat * (row + 1);
            var minLon = this.sector.minLongitude + deltaLon * column;

            return new Sector(minLat, minLat + deltaLat, minLon, minLon + deltaLon);
        };

        return TileMatrix;
    });