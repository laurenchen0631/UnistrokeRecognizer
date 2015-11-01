'use strict';

/**
 * The $1 Unistroke Recognizer (JavaScript version)
 *
 *	Jacob O. Wobbrock, Ph.D.
 * 	The Information School
 *	University of Washington
 *	Seattle, WA 98195-2840
 *	wobbrock@uw.edu
 *
 *	Andrew D. Wilson, Ph.D.
 *	Microsoft Research
 *	One Microsoft Way
 *	Redmond, WA 98052
 *	awilson@microsoft.com
 *
 *	Yang Li, Ph.D.
 *	Department of Computer Science and Engineering
 * 	University of Washington
 *	Seattle, WA 98195-2840
 * 	yangli@cs.washington.edu
 *
 * The academic publication for the $1 recognizer, and what should be
 * used to cite it, is:
 *
 *	Wobbrock, J.O., Wilson, A.D. and Li, Y. (2007). Gestures without
 *	  libraries, toolkits or training: A $1 recognizer for user interface
 *	  prototypes. Proceedings of the ACM Symposium on User Interface
 *	  Software and Technology (UIST '07). Newport, Rhode Island (October
 *	  7-10, 2007). New York: ACM Press, pp. 159-168.
 *
 * The Protractor enhancement was separately published by Yang Li and programmed
 * here by Jacob O. Wobbrock:
 *
 *	Li, Y. (2010). Protractor: A fast and accurate gesture
 *	  recognizer. Proceedings of the ACM Conference on Human
 *	  Factors in Computing Systems (CHI '10). Atlanta, Georgia
 *	  (April 10-15, 2010). New York: ACM Press, pp. 2169-2172.
 *
 * This software is distributed under the "New BSD License" agreement:
 *
 * Copyright (C) 2007-2012, Jacob O. Wobbrock, Andrew D. Wilson and Yang Li.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *    * Redistributions of source code must retain the above copyright
 *      notice, this list of conditions and the following disclaimer.
 *    * Redistributions in binary form must reproduce the above copyright
 *      notice, this list of conditions and the following disclaimer in the
 *      documentation and/or other materials provided with the distribution.
 *    * Neither the names of the University of Washington nor Microsoft,
 *      nor the names of its contributors may be used to endorse or promote
 *      products derived from this software without specific prior written
 *      permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL Jacob O. Wobbrock OR Andrew D. Wilson
 * OR Yang Li BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
 * OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
**/
//
// Point class
//
class Point {
	constructor(x, y) {
		this.X = x;
		this.Y = y;
	}
}

//
// Rectangle class
//

class Rectangle {
	constructor(x, y, width, height) {
		this.X = x;
		this.Y = y;
		this.Width = width;
		this.Height = height;
	}
}

//
// Unistroke class: a unistroke template
//

class Unistroke {
	constructor(name, points) {
		this.Name = name;

		this.Points = Resample(points, NumPoints);
		const radians = IndicativeAngle(this.Points);
		this.Points = RotateBy(this.Points, -radians);
		this.Points = ScaleTo(this.Points, SquareSize);
		this.Points = TranslateTo(this.Points, Origin);
		this.Vector = Vectorize(this.Points); // for Protractor
	}
}

//
// Result class
//
class Result {
	constructor(name, score) {
		this.Name = name;
		this.Score = score;
	}
}

//
// DollarRecognizer class constants
//
const NumUnistrokes = 16;
const NumPoints = 64;
const SquareSize = 250;
const Origin = new Point(0, 0);
const Diagonal = Math.sqrt(SquareSize * SquareSize + SquareSize * SquareSize);
const HalfDiagonal = 0.5 * Diagonal;
const AngleRange = Deg2Rad(45);
const AnglePrecision = Deg2Rad(2);
const Phi = 0.5 * (-1.0 + Math.sqrt(5.0)); // Golden Ratio
//
// DollarRecognizer class
//

export default class DollarRecognizer {
	constructor() {
		this.Unistrokes = [
			new Unistroke(
				"triangle",
				[
					new Point(137,139),
					new Point(135,141),
					new Point(133,144),
					new Point(132,146),
					new Point(130,149),
					new Point(128,151),
					new Point(126,155),
					new Point(123,160),
					new Point(120,166),
					new Point(116,171),
					new Point(112,177),
					new Point(107,183),
					new Point(102,188),
					new Point(100,191),
					new Point(95,195),
					new Point(90,199),
					new Point(86,203),
					new Point(82,206),
					new Point(80,209),
					new Point(75,213),
					new Point(73,213),
					new Point(70,216),
					new Point(67,219),
					new Point(64,221),
					new Point(61,223),
					new Point(60,225),
					new Point(62,226),
					new Point(65,225),
					new Point(67,226),
					new Point(74,226),
					new Point(77,227),
					new Point(85,229),
					new Point(91,230),
					new Point(99,231),
					new Point(108,232),
					new Point(116,233),
					new Point(125,233),
					new Point(134,234),
					new Point(145,233),
					new Point(153,232),
					new Point(160,233),
					new Point(170,234),
					new Point(177,235),
					new Point(179,236),
					new Point(186,237),
					new Point(193,238),
					new Point(198,239),
					new Point(200,237),
					new Point(202,239),
					new Point(204,238),
					new Point(206,234),
					new Point(205,230),
					new Point(202,222),
					new Point(197,216),
					new Point(192,207),
					new Point(186,198),
					new Point(179,189),
					new Point(174,183),
					new Point(170,178),
					new Point(164,171),
					new Point(161,168),
					new Point(154,160),
					new Point(148,155),
					new Point(143,150),
					new Point(138,148),
					new Point(136,148)
				]
			),
			new Unistroke(
				"x",
				[
					new Point(87,142),
					new Point(89,145),
					new Point(91,148),
					new Point(93,151),
					new Point(96,155),
					new Point(98,157),
					new Point(100,160),
					new Point(102,162),
					new Point(106,167),
					new Point(108,169),
					new Point(110,171),
					new Point(115,177),
					new Point(119,183),
					new Point(123,189),
					new Point(127,193),
					new Point(129,196),
					new Point(133,200),
					new Point(137,206),
					new Point(140,209),
					new Point(143,212),
					new Point(146,215),
					new Point(151,220),
					new Point(153,222),
					new Point(155,223),
					new Point(157,225),
					new Point(158,223),
					new Point(157,218),
					new Point(155,211),
					new Point(154,208),
					new Point(152,200),
					new Point(150,189),
					new Point(148,179),
					new Point(147,170),
					new Point(147,158),
					new Point(147,148),
					new Point(147,141),
					new Point(147,136),
					new Point(144,135),
					new Point(142,137),
					new Point(140,139),
					new Point(135,145),
					new Point(131,152),
					new Point(124,163),
					new Point(116,177),
					new Point(108,191),
					new Point(100,206),
					new Point(94,217),
					new Point(91,222),
					new Point(89,225),
					new Point(87,226),
					new Point(87,224)
				]
			),
			new Unistroke(
				"rectangle",
				[
					new Point(78,149),
					new Point(78,153),
					new Point(78,157),
					new Point(78,160),
					new Point(79,162),
					new Point(79,164),
					new Point(79,167),
					new Point(79,169),
					new Point(79,173),
					new Point(79,178),
					new Point(79,183),
					new Point(80,189),
					new Point(80,193),
					new Point(80,198),
					new Point(80,202),
					new Point(81,208),
					new Point(81,210),
					new Point(81,216),
					new Point(82,222),
					new Point(82,224),
					new Point(82,227),
					new Point(83,229),
					new Point(83,231),
					new Point(85,230),
					new Point(88,232),
					new Point(90,233),
					new Point(92,232),
					new Point(94,233),
					new Point(99,232),
					new Point(102,233),
					new Point(106,233),
					new Point(109,234),
					new Point(117,235),
					new Point(123,236),
					new Point(126,236),
					new Point(135,237),
					new Point(142,238),
					new Point(145,238),
					new Point(152,238),
					new Point(154,239),
					new Point(165,238),
					new Point(174,237),
					new Point(179,236),
					new Point(186,235),
					new Point(191,235),
					new Point(195,233),
					new Point(197,233),
					new Point(200,233),
					new Point(201,235),
					new Point(201,233),
					new Point(199,231),
					new Point(198,226),
					new Point(198,220),
					new Point(196,207),
					new Point(195,195),
					new Point(195,181),
					new Point(195,173),
					new Point(195,163),
					new Point(194,155),
					new Point(192,145),
					new Point(192,143),
					new Point(192,138),
					new Point(191,135),
					new Point(191,133),
					new Point(191,130),
					new Point(190,128),
					new Point(188,129),
					new Point(186,129),
					new Point(181,132),
					new Point(173,131),
					new Point(162,131),
					new Point(151,132),
					new Point(149,132),
					new Point(138,132),
					new Point(136,132),
					new Point(122,131),
					new Point(120,131),
					new Point(109,130),
					new Point(107,130),
					new Point(90,132),
					new Point(81,133),
					new Point(76,133)
				]
			),
			new Unistroke(
				"circle",
				[new Point(127,141),new Point(124,140),new Point(120,139),new Point(118,139),new Point(116,139),new Point(111,140),new Point(109,141),new Point(104,144),new Point(100,147),new Point(96,152),new Point(93,157),new Point(90,163),new Point(87,169),new Point(85,175),new Point(83,181),new Point(82,190),new Point(82,195),new Point(83,200),new Point(84,205),new Point(88,213),new Point(91,216),new Point(96,219),new Point(103,222),new Point(108,224),new Point(111,224),new Point(120,224),new Point(133,223),new Point(142,222),new Point(152,218),new Point(160,214),new Point(167,210),new Point(173,204),new Point(178,198),new Point(179,196),new Point(182,188),new Point(182,177),new Point(178,167),new Point(170,150),new Point(163,138),new Point(152,130),new Point(143,129),new Point(140,131),new Point(129,136),new Point(126,139)]
			),
			new Unistroke(
				"check",
				[new Point(91,185),new Point(93,185),new Point(95,185),new Point(97,185),new Point(100,188),new Point(102,189),new Point(104,190),new Point(106,193),new Point(108,195),new Point(110,198),new Point(112,201),new Point(114,204),new Point(115,207),new Point(117,210),new Point(118,212),new Point(120,214),new Point(121,217),new Point(122,219),new Point(123,222),new Point(124,224),new Point(126,226),new Point(127,229),new Point(129,231),new Point(130,233),new Point(129,231),new Point(129,228),new Point(129,226),new Point(129,224),new Point(129,221),new Point(129,218),new Point(129,212),new Point(129,208),new Point(130,198),new Point(132,189),new Point(134,182),new Point(137,173),new Point(143,164),new Point(147,157),new Point(151,151),new Point(155,144),new Point(161,137),new Point(165,131),new Point(171,122),new Point(174,118),new Point(176,114),new Point(177,112),new Point(177,114),new Point(175,116),new Point(173,118)]
			),
			new Unistroke(
				"caret",
				[new Point(79,245),new Point(79,242),new Point(79,239),new Point(80,237),new Point(80,234),new Point(81,232),new Point(82,230),new Point(84,224),new Point(86,220),new Point(86,218),new Point(87,216),new Point(88,213),new Point(90,207),new Point(91,202),new Point(92,200),new Point(93,194),new Point(94,192),new Point(96,189),new Point(97,186),new Point(100,179),new Point(102,173),new Point(105,165),new Point(107,160),new Point(109,158),new Point(112,151),new Point(115,144),new Point(117,139),new Point(119,136),new Point(119,134),new Point(120,132),new Point(121,129),new Point(122,127),new Point(124,125),new Point(126,124),new Point(129,125),new Point(131,127),new Point(132,130),new Point(136,139),new Point(141,154),new Point(145,166),new Point(151,182),new Point(156,193),new Point(157,196),new Point(161,209),new Point(162,211),new Point(167,223),new Point(169,229),new Point(170,231),new Point(173,237),new Point(176,242),new Point(177,244),new Point(179,250),new Point(181,255),new Point(182,257)]
			),
			new Unistroke(
				"zig-zag",
				[new Point(307,216),new Point(333,186),new Point(356,215),new Point(375,186),new Point(399,216),new Point(418,186)]
			),
			new Unistroke(
				"arrow",
				[new Point(68,222),new Point(70,220),new Point(73,218),new Point(75,217),new Point(77,215),new Point(80,213),new Point(82,212),new Point(84,210),new Point(87,209),new Point(89,208),new Point(92,206),new Point(95,204),new Point(101,201),new Point(106,198),new Point(112,194),new Point(118,191),new Point(124,187),new Point(127,186),new Point(132,183),new Point(138,181),new Point(141,180),new Point(146,178),new Point(154,173),new Point(159,171),new Point(161,170),new Point(166,167),new Point(168,167),new Point(171,166),new Point(174,164),new Point(177,162),new Point(180,160),new Point(182,158),new Point(183,156),new Point(181,154),new Point(178,153),new Point(171,153),new Point(164,153),new Point(160,153),new Point(150,154),new Point(147,155),new Point(141,157),new Point(137,158),new Point(135,158),new Point(137,158),new Point(140,157),new Point(143,156),new Point(151,154),new Point(160,152),new Point(170,149),new Point(179,147),new Point(185,145),new Point(192,144),new Point(196,144),new Point(198,144),new Point(200,144),new Point(201,147),new Point(199,149),new Point(194,157),new Point(191,160),new Point(186,167),new Point(180,176),new Point(177,179),new Point(171,187),new Point(169,189),new Point(165,194),new Point(164,196)]
			),
			new Unistroke(
				"left square bracket",
				[new Point(140,124),new Point(138,123),new Point(135,122),new Point(133,123),new Point(130,123),new Point(128,124),new Point(125,125),new Point(122,124),new Point(120,124),new Point(118,124),new Point(116,125),new Point(113,125),new Point(111,125),new Point(108,124),new Point(106,125),new Point(104,125),new Point(102,124),new Point(100,123),new Point(98,123),new Point(95,124),new Point(93,123),new Point(90,124),new Point(88,124),new Point(85,125),new Point(83,126),new Point(81,127),new Point(81,129),new Point(82,131),new Point(82,134),new Point(83,138),new Point(84,141),new Point(84,144),new Point(85,148),new Point(85,151),new Point(86,156),new Point(86,160),new Point(86,164),new Point(86,168),new Point(87,171),new Point(87,175),new Point(87,179),new Point(87,182),new Point(87,186),new Point(88,188),new Point(88,195),new Point(88,198),new Point(88,201),new Point(88,207),new Point(89,211),new Point(89,213),new Point(89,217),new Point(89,222),new Point(88,225),new Point(88,229),new Point(88,231),new Point(88,233),new Point(88,235),new Point(89,237),new Point(89,240),new Point(89,242),new Point(91,241),new Point(94,241),new Point(96,240),new Point(98,239),new Point(105,240),new Point(109,240),new Point(113,239),new Point(116,240),new Point(121,239),new Point(130,240),new Point(136,237),new Point(139,237),new Point(144,238),new Point(151,237),new Point(157,236),new Point(159,237)]
			),
			new Unistroke(
				"right square bracket",
				[new Point(112,138),new Point(112,136),new Point(115,136),new Point(118,137),new Point(120,136),new Point(123,136),new Point(125,136),new Point(128,136),new Point(131,136),new Point(134,135),new Point(137,135),new Point(140,134),new Point(143,133),new Point(145,132),new Point(147,132),new Point(149,132),new Point(152,132),new Point(153,134),new Point(154,137),new Point(155,141),new Point(156,144),new Point(157,152),new Point(158,161),new Point(160,170),new Point(162,182),new Point(164,192),new Point(166,200),new Point(167,209),new Point(168,214),new Point(168,216),new Point(169,221),new Point(169,223),new Point(169,228),new Point(169,231),new Point(166,233),new Point(164,234),new Point(161,235),new Point(155,236),new Point(147,235),new Point(140,233),new Point(131,233),new Point(124,233),new Point(117,235),new Point(114,238),new Point(112,238)]
			),
			new Unistroke(
				"v",
				[new Point(89,164),new Point(90,162),new Point(92,162),new Point(94,164),new Point(95,166),new Point(96,169),new Point(97,171),new Point(99,175),new Point(101,178),new Point(103,182),new Point(106,189),new Point(108,194),new Point(111,199),new Point(114,204),new Point(117,209),new Point(119,214),new Point(122,218),new Point(124,222),new Point(126,225),new Point(128,228),new Point(130,229),new Point(133,233),new Point(134,236),new Point(136,239),new Point(138,240),new Point(139,242),new Point(140,244),new Point(142,242),new Point(142,240),new Point(142,237),new Point(143,235),new Point(143,233),new Point(145,229),new Point(146,226),new Point(148,217),new Point(149,208),new Point(149,205),new Point(151,196),new Point(151,193),new Point(153,182),new Point(155,172),new Point(157,165),new Point(159,160),new Point(162,155),new Point(164,150),new Point(165,148),new Point(166,146)]
			),
			new Unistroke(
				"delete",
				[new Point(123,129),new Point(123,131),new Point(124,133),new Point(125,136),new Point(127,140),new Point(129,142),new Point(133,148),new Point(137,154),new Point(143,158),new Point(145,161),new Point(148,164),new Point(153,170),new Point(158,176),new Point(160,178),new Point(164,183),new Point(168,188),new Point(171,191),new Point(175,196),new Point(178,200),new Point(180,202),new Point(181,205),new Point(184,208),new Point(186,210),new Point(187,213),new Point(188,215),new Point(186,212),new Point(183,211),new Point(177,208),new Point(169,206),new Point(162,205),new Point(154,207),new Point(145,209),new Point(137,210),new Point(129,214),new Point(122,217),new Point(118,218),new Point(111,221),new Point(109,222),new Point(110,219),new Point(112,217),new Point(118,209),new Point(120,207),new Point(128,196),new Point(135,187),new Point(138,183),new Point(148,167),new Point(157,153),new Point(163,145),new Point(165,142),new Point(172,133),new Point(177,127),new Point(179,127),new Point(180,125)]
			),
			new Unistroke(
				"left curly brace",
				[new Point(150,116),new Point(147,117),new Point(145,116),new Point(142,116),new Point(139,117),new Point(136,117),new Point(133,118),new Point(129,121),new Point(126,122),new Point(123,123),new Point(120,125),new Point(118,127),new Point(115,128),new Point(113,129),new Point(112,131),new Point(113,134),new Point(115,134),new Point(117,135),new Point(120,135),new Point(123,137),new Point(126,138),new Point(129,140),new Point(135,143),new Point(137,144),new Point(139,147),new Point(141,149),new Point(140,152),new Point(139,155),new Point(134,159),new Point(131,161),new Point(124,166),new Point(121,166),new Point(117,166),new Point(114,167),new Point(112,166),new Point(114,164),new Point(116,163),new Point(118,163),new Point(120,162),new Point(122,163),new Point(125,164),new Point(127,165),new Point(129,166),new Point(130,168),new Point(129,171),new Point(127,175),new Point(125,179),new Point(123,184),new Point(121,190),new Point(120,194),new Point(119,199),new Point(120,202),new Point(123,207),new Point(127,211),new Point(133,215),new Point(142,219),new Point(148,220),new Point(151,221)]
			),
			new Unistroke(
				"right curly brace",
				[new Point(117,132),new Point(115,132),new Point(115,129),new Point(117,129),new Point(119,128),new Point(122,127),new Point(125,127),new Point(127,127),new Point(130,127),new Point(133,129),new Point(136,129),new Point(138,130),new Point(140,131),new Point(143,134),new Point(144,136),new Point(145,139),new Point(145,142),new Point(145,145),new Point(145,147),new Point(145,149),new Point(144,152),new Point(142,157),new Point(141,160),new Point(139,163),new Point(137,166),new Point(135,167),new Point(133,169),new Point(131,172),new Point(128,173),new Point(126,176),new Point(125,178),new Point(125,180),new Point(125,182),new Point(126,184),new Point(128,187),new Point(130,187),new Point(132,188),new Point(135,189),new Point(140,189),new Point(145,189),new Point(150,187),new Point(155,186),new Point(157,185),new Point(159,184),new Point(156,185),new Point(154,185),new Point(149,185),new Point(145,187),new Point(141,188),new Point(136,191),new Point(134,191),new Point(131,192),new Point(129,193),new Point(129,195),new Point(129,197),new Point(131,200),new Point(133,202),new Point(136,206),new Point(139,211),new Point(142,215),new Point(145,220),new Point(147,225),new Point(148,231),new Point(147,239),new Point(144,244),new Point(139,248),new Point(134,250),new Point(126,253),new Point(119,253),new Point(115,253)]
			),
			new Unistroke(
				"star",
				[new Point(75,250),new Point(75,247),new Point(77,244),new Point(78,242),new Point(79,239),new Point(80,237),new Point(82,234),new Point(82,232),new Point(84,229),new Point(85,225),new Point(87,222),new Point(88,219),new Point(89,216),new Point(91,212),new Point(92,208),new Point(94,204),new Point(95,201),new Point(96,196),new Point(97,194),new Point(98,191),new Point(100,185),new Point(102,178),new Point(104,173),new Point(104,171),new Point(105,164),new Point(106,158),new Point(107,156),new Point(107,152),new Point(108,145),new Point(109,141),new Point(110,139),new Point(112,133),new Point(113,131),new Point(116,127),new Point(117,125),new Point(119,122),new Point(121,121),new Point(123,120),new Point(125,122),new Point(125,125),new Point(127,130),new Point(128,133),new Point(131,143),new Point(136,153),new Point(140,163),new Point(144,172),new Point(145,175),new Point(151,189),new Point(156,201),new Point(161,213),new Point(166,225),new Point(169,233),new Point(171,236),new Point(174,243),new Point(177,247),new Point(178,249),new Point(179,251),new Point(180,253),new Point(180,255),new Point(179,257),new Point(177,257),new Point(174,255),new Point(169,250),new Point(164,247),new Point(160,245),new Point(149,238),new Point(138,230),new Point(127,221),new Point(124,220),new Point(112,212),new Point(110,210),new Point(96,201),new Point(84,195),new Point(74,190),new Point(64,182),new Point(55,175),new Point(51,172),new Point(49,170),new Point(51,169),new Point(56,169),new Point(66,169),new Point(78,168),new Point(92,166),new Point(107,164),new Point(123,161),new Point(140,162),new Point(156,162),new Point(171,160),new Point(173,160),new Point(186,160),new Point(195,160),new Point(198,161),new Point(203,163),new Point(208,163),new Point(206,164),new Point(200,167),new Point(187,172),new Point(174,179),new Point(172,181),new Point(153,192),new Point(137,201),new Point(123,211),new Point(112,220),new Point(99,229),new Point(90,237),new Point(80,244),new Point(73,250),new Point(69,254),new Point(69,252)]
			),
			new Unistroke(
				"pigtail",
				[new Point(81,219),new Point(84,218),new Point(86,220),new Point(88,220),new Point(90,220),new Point(92,219),new Point(95,220),new Point(97,219),new Point(99,220),new Point(102,218),new Point(105,217),new Point(107,216),new Point(110,216),new Point(113,214),new Point(116,212),new Point(118,210),new Point(121,208),new Point(124,205),new Point(126,202),new Point(129,199),new Point(132,196),new Point(136,191),new Point(139,187),new Point(142,182),new Point(144,179),new Point(146,174),new Point(148,170),new Point(149,168),new Point(151,162),new Point(152,160),new Point(152,157),new Point(152,155),new Point(152,151),new Point(152,149),new Point(152,146),new Point(149,142),new Point(148,139),new Point(145,137),new Point(141,135),new Point(139,135),new Point(134,136),new Point(130,140),new Point(128,142),new Point(126,145),new Point(122,150),new Point(119,158),new Point(117,163),new Point(115,170),new Point(114,175),new Point(117,184),new Point(120,190),new Point(125,199),new Point(129,203),new Point(133,208),new Point(138,213),new Point(145,215),new Point(155,218),new Point(164,219),new Point(166,219),new Point(177,219),new Point(182,218),new Point(192,216),new Point(196,213),new Point(199,212),new Point(201,211)]
			),

			// Palm Graffiti 0-9
			new Unistroke(
				'zero',
				[{"X":238,"Y":159},{"X":232.75481137227345,"Y":158.24518862772655},{"X":225,"Y":162.4508574782218},{"X":218.20239343910768,"Y":166},{"X":211.7766048019745,"Y":171.2233951980255},{"X":205.4083902103783,"Y":178},{"X":201,"Y":185.94765408737769},{"X":196,"Y":194.03857035471134},{"X":192.18735649942883,"Y":201.81264350057117},{"X":189,"Y":210.60965102517994},{"X":186,"Y":219.379908885309},{"X":184,"Y":228.66873557535303},{"X":182.17756144456447,"Y":238.11219277717768},{"X":181.61737595504394,"Y":247.76524808991212},{"X":181,"Y":257.3804680418915},{"X":181,"Y":267.1414306869351},{"X":182,"Y":276.66632535447894},{"X":183.00584706604675,"Y":286.0116941320935},{"X":185.58222788407767,"Y":295.16445576815534},{"X":188,"Y":304.3546598397378},{"X":189.94093017728608,"Y":313.7637207091443},{"X":192.83500591467813,"Y":322.67001182935627},{"X":199.0916545653859,"Y":330.0916545653859},{"X":205.2865906614183,"Y":337.2865906614183},{"X":212.33825687109373,"Y":343.6691284355469},{"X":219.53890514302051,"Y":349.76945257151027},{"X":228.01867016048843,"Y":354},{"X":237.20314158299058,"Y":356},{"X":246.135677103288,"Y":358},{"X":255.89663974833164,"Y":358},{"X":265.65760239337527,"Y":358},{"X":275.0576575245635,"Y":356.47117123771824},{"X":283.9597007998788,"Y":352.5201496000606},{"X":292.88966884833945,"Y":349},{"X":301.6224281417431,"Y":345.12585728608565},{"X":308.8772009398152,"Y":339.1227990601848},{"X":315.6169661568658,"Y":332.3830338431342},{"X":321.5559659051035,"Y":324.6660511423447},{"X":326.64732867993683,"Y":316.5290069800948},{"X":332.13686680124476,"Y":308.7262663975105},{"X":336,"Y":299.87726579350937},{"X":338,"Y":290.76658468833864},{"X":340.11689155482696,"Y":281.41554222586524},{"X":342,"Y":271.9780925270121},{"X":343,"Y":262.37940754213685},{"X":344,"Y":252.854512874593},{"X":344,"Y":243.09355022954938},{"X":344,"Y":233.33258758450575},{"X":343.80842484895436,"Y":223.6168496979087},{"X":342,"Y":214.28279824941808},{"X":340.076973126926,"Y":205.15394625385207},{"X":338,"Y":196.2395816239499},{"X":334.8029008196565,"Y":187.8029008196565},{"X":330.38157124763626,"Y":179.76314249527255},{"X":326.1108401936928,"Y":172.11084019369284},{"X":319.63842974725213,"Y":167},{"X":312,"Y":162.3561757668276},{"X":305,"Y":157.83785380890325},{"X":297.31953185097893,"Y":154},{"X":288.3869963306815,"Y":152},{"X":280.02845910199267,"Y":150.02845910199264},{"X":271.2792846029673,"Y":151},{"X":263.9522954089126,"Y":154.04770459108735},{"X":257,"Y":154}]
			),
			new Unistroke(
				'one',
				[{"X":268,"Y":176},{"X":265.92459526757926,"Y":180.45242839452453},{"X":265.1139759130647,"Y":185.3161445216119},{"X":263.97225125732876,"Y":190.110994970685},{"X":262.89816994050466,"Y":194.916470535458},{"X":262.35365361560434,"Y":199.81711745956102},{"X":261.69082597513585,"Y":204.70045713675287},{"X":260.8087767555966,"Y":209.55172784421845},{"X":259.93266126639077,"Y":214.40403240165554},{"X":259.1220419118762,"Y":219.2677485287429},{"X":258.3114225573616,"Y":224.13146465583029},{"X":257.78365864812474,"Y":229.02877892625324},{"X":257.432353335246,"Y":233.9470533065564},{"X":257.08104802236716,"Y":238.86532768685956},{"X":256.77725316979917,"Y":243.78669611341445},{"X":256.4877063282382,"Y":248.70899241995122},{"X":256.1981594866772,"Y":253.63128872648798},{"X":255.84514528995706,"Y":258.5485471004295},{"X":255.35451185111,"Y":263.4548814889},{"X":254.86387841226295,"Y":268.36121587737057},{"X":254.3732449734159,"Y":273.26755026584107},{"X":253.94643078985888,"Y":278.17852262310464},{"X":253.72253446672931,"Y":283.10424173195486},{"X":253.49863814359975,"Y":288.0299608408051},{"X":253.2747418204702,"Y":292.9556799496553},{"X":253.05084549734065,"Y":297.8813990585055},{"X":252.84134394957292,"Y":302.80774521024966},{"X":252.63607185005569,"Y":307.7342755986633},{"X":252.43079975053845,"Y":312.66080598707697},{"X":252.22552765102122,"Y":317.5873363754906},{"X":252.020255551504,"Y":322.5138667639043},{"X":252,"Y":327.4442499922205},{"X":252,"Y":332.3750550281962},{"X":252,"Y":337.3058600641719},{"X":252,"Y":342.2366651001476},{"X":252,"Y":347.1674701361233},{"X":252,"Y":352.098275172099},{"X":252,"Y":357.02908020807473},{"X":252,"Y":361.95988524405044},{"X":252,"Y":366.89069028002615},{"X":252,"Y":371.82149531600186},{"X":252,"Y":376.75230035197757},{"X":252,"Y":381.6831053879533},{"X":252,"Y":386.613910423929},{"X":252,"Y":391.5447154599047},{"X":252.12362159426002,"Y":396.4724318852006},{"X":252.3698542473716,"Y":401.39708494743195},{"X":252.61608690048317,"Y":406.32173800966336},{"X":252.86231955359474,"Y":411.2463910718948},{"X":253,"Y":416.17375624528245},{"X":253,"Y":421.10456128125816},{"X":253,"Y":426.03536631723387},{"X":253,"Y":430.9661713532096},{"X":253.25922301344312,"Y":435.8883452016467},{"X":253.58721528552186,"Y":440.8082292828279},{"X":253.9152075576006,"Y":445.72811336400906},{"X":254.28040969519688,"Y":450.64532603755964},{"X":254.65858517813945,"Y":455.561607315813},{"X":255,"Y":460.47930038028557},{"X":255,"Y":465.4101054162613},{"X":255.0422847374619,"Y":470.3382778996952},{"X":255.6538758314103,"Y":475.2310066512822},{"X":256.3026788644706,"Y":480.11875205129394},{"X":257,"Y":485}]
			),
			new Unistroke(
				'two',
				[{"X":183,"Y":236},{"X":182,"Y":222.61056716014187},{"X":183.42477325265847,"Y":209.57522674734153},{"X":189.0434828943875,"Y":197.913034211225},{"X":196.99344901570558,"Y":187.00982647644165},{"X":207.23409844048263,"Y":178.07442616963803},{"X":217.74038654467353,"Y":169.44471009149487},{"X":228.9468990469182,"Y":161.70206730205453},{"X":241.45133878888768,"Y":156.41946448444494},{"X":254.45434378810106,"Y":152.848552070633},{"X":267.70607558340583,"Y":151},{"X":281.16929874059537,"Y":150},{"X":294.7947995579533,"Y":150},{"X":307.6600611248839,"Y":153.66006112488392},{"X":319.31526068214816,"Y":160.31526068214816},{"X":328.02609596732805,"Y":170.05219193465604},{"X":333.14951730433364,"Y":182.5980692173345},{"X":335.7265797863956,"Y":195.9063191455824},{"X":337,"Y":209.42709258462253},{"X":334.64101563881246,"Y":222.79492180593778},{"X":331.92893304633463,"Y":236.14213390733067},{"X":327.17796084923276,"Y":248.85877106871268},{"X":322.3392093978122,"Y":261.4346510036463},{"X":316.55093394706887,"Y":273.74844342155194},{"X":310.7810172017591,"Y":286.04745699560226},{"X":304.823935562311,"Y":298.2934407294816},{"X":297.97358333996885,"Y":310.0528333200623},{"X":290.1814545915941,"Y":321.09139387787457},{"X":282.00615410117933,"Y":331.9917945317609},{"X":272.88921684196316,"Y":342.11078315803684},{"X":263.25453281694655,"Y":351.74546718305345},{"X":253.61984879192994,"Y":361.38015120807006},{"X":243.50181295609977,"Y":370.4981870439002},{"X":233.4026628370159,"Y":379.5973371629841},{"X":223.76797881199928,"Y":389.2320211880007},{"X":214.6688286929154,"Y":399.3311713070846},{"X":204.55334707310143,"Y":408.4466529268986},{"X":194.18105848562251,"Y":417.21262767625166},{"X":184.3032021227399,"Y":426.5574383018081},{"X":173.81154098664578,"Y":435.1884590133542},{"X":162.97122934691825,"Y":443.35251376872117},{"X":152.45847189842385,"Y":451.95127341798013},{"X":141.1861574087675,"Y":459.5425617274883},{"X":139.16963948142944,"Y":463},{"X":152.62211189815852,"Y":461.5944720254604},{"X":165.96021932626107,"Y":459.25994516843474},{"X":179.18297857492186,"Y":455.97712767813476},{"X":192.57603529487838,"Y":453.6059911762804},{"X":205.48252982950484,"Y":449.50349403409905},{"X":218.7037704002108,"Y":446.22749417136833},{"X":231.92128661185168,"Y":444},{"X":245.38450976904122,"Y":443},{"X":258.77666511436524,"Y":441},{"X":272.2398882715548,"Y":440},{"X":285.8653890889127,"Y":440},{"X":299.49088990627064,"Y":440},{"X":313.11639072362857,"Y":440},{"X":326.66002551469995,"Y":440.665006378675},{"X":340.01094126069285,"Y":443},{"X":353.6364420780508,"Y":443},{"X":366.72462370741795,"Y":445},{"X":379.69984298490294,"Y":447},{"X":392.39264842509755,"Y":450.1963242125488},{"X":404,"Y":454}]
			),
			new Unistroke(
				'three',
				[{"X":154,"Y":197},{"X":162.73053021773867,"Y":184.8463131881742},{"X":175.4838256775965,"Y":175.75808716120173},{"X":188.63255784780375,"Y":167.18372107609812},{"X":203.37587126202578,"Y":161.6496514951897},{"X":218.13317264714692,"Y":156.14673094114124},{"X":233.38234394720723,"Y":152.46218744365507},{"X":248.65385333636803,"Y":148.586536665908},{"X":264.2496481099894,"Y":146.46879398625134},{"X":279.9146618689526,"Y":145},{"X":295.6592487176054,"Y":144.66719652017105},{"X":311.3919081518577,"Y":144},{"X":326.8921823975914,"Y":146.6307274658638},{"X":341.2201165034856,"Y":153.1100582517428},{"X":354.0951164001427,"Y":162.11889550017835},{"X":362.61632446457537,"Y":175.30938403623566},{"X":366,"Y":190.62119051905813},{"X":364.3741823171242,"Y":206.06454420718944},{"X":358.8058008716434,"Y":220.65699854726108},{"X":349.9014554940839,"Y":233.62318063239516},{"X":340.62630157162675,"Y":246.29895874269857},{"X":329.5754888268192,"Y":257.4245111731808},{"X":317.6241525399993,"Y":267.6711479218188},{"X":305.5193798257963,"Y":277.65374678280244},{"X":292.40921467089856,"Y":286.3938568860676},{"X":278.7217269721486,"Y":294.13913651392573},{"X":264.8204142827394,"Y":301.55250130032397},{"X":250.21635147364262,"Y":307.3918242631787},{"X":235.58149175871554,"Y":313.1674032965138},{"X":220.69941133466648,"Y":318},{"X":231.46471272523843,"Y":312.8450957582539},{"X":246.69337370058028,"Y":308.82665657485495},{"X":262.28304802727104,"Y":307.3433903945458},{"X":278.0055032426924,"Y":307},{"X":293.5801787640631,"Y":309},{"X":309.2175186120248,"Y":310.4031852021863},{"X":324.67928946805694,"Y":313.4198223670142},{"X":338.9534146880307,"Y":319.9767073440153},{"X":351.1878633166485,"Y":329.89089748748637},{"X":363.5848290319825,"Y":339.5848290319825},{"X":374.09182507633767,"Y":351.18365015267534},{"X":377,"Y":366.4795054492567},{"X":376.56149157528074,"Y":382.19254212359635},{"X":373.7698253968147,"Y":397.69052380955577},{"X":368.78719602061295,"Y":412.6384119381612},{"X":362.87941972777634,"Y":427.20096712037275},{"X":353.3435784698971,"Y":439.6564215301029},{"X":343.04834587491297,"Y":451.57061089072295},{"X":331.2791873108066,"Y":461.9766501513547},{"X":318.2528655688279,"Y":470.83142295411477},{"X":304.58342858861835,"Y":478.6666122350752},{"X":290.2507317968914,"Y":485.1559755761657},{"X":275.2736908143794,"Y":489.88618297230386},{"X":259.7467912238677,"Y":492.53165109701655},{"X":244.0748771448613,"Y":494},{"X":228.3348208369448,"Y":493.70386898188275},{"X":212.8974897085067,"Y":490.7243724271267},{"X":198.0782734483542,"Y":485.53424463365496},{"X":183.5029089538429,"Y":479.5635908576911},{"X":169.71318732478565,"Y":471.9789641855918},{"X":156.23981162749237,"Y":463.8265410849949},{"X":143.9949018187174,"Y":453.99490181871744},{"X":133.62126945070773,"Y":442.14552334084925},{"X":125,"Y":429}]
			),
			new Unistroke(
				'four',
				[{"X":178,"Y":198},{"X":180.6247974666093,"Y":201.6247974666093},{"X":182.2375268238153,"Y":206.4750536476306},{"X":183,"Y":211.59286876041915},{"X":183.14642678706772,"Y":216.8785607224063},{"X":184,"Y":222.10572745689754},{"X":184,"Y":227.40353807028586},{"X":184,"Y":232.70134868367418},{"X":184,"Y":237.9991592970625},{"X":184,"Y":243.29696991045083},{"X":184,"Y":248.59478052383915},{"X":184,"Y":253.89259113722747},{"X":184,"Y":259.19040175061576},{"X":184,"Y":264.4882123640041},{"X":184,"Y":269.7860229773924},{"X":184,"Y":275.0838335907807},{"X":184,"Y":280.38164420416905},{"X":184,"Y":285.67945481755737},{"X":184,"Y":290.9772654309457},{"X":183.41746530226334,"Y":296.24281227963},{"X":182.9158241609314,"Y":301.5151651032345},{"X":182.62195450225036,"Y":306.80481895949356},{"X":182.3280848435693,"Y":312.0944728157526},{"X":182.03421518488824,"Y":317.3841266720117},{"X":181.4193949459373,"Y":322.6448404325015},{"X":181,"Y":327.916540460908},{"X":180.76184616060812,"Y":333.1907691969595},{"X":180,"Y":338.41314217409183},{"X":180,"Y":343.71095278748015},{"X":180,"Y":349.0087634008685},{"X":180.3065740142568,"Y":354},{"X":185.60438462764512,"Y":354},{"X":190.40799006183184,"Y":351.86400331272273},{"X":195.43393450698807,"Y":350.1886884976706},{"X":200.45987895214432,"Y":348.5133736826186},{"X":205.53300482957667,"Y":346.9905700486924},{"X":210.6790147499218,"Y":345.79012315625977},{"X":215.9359150166059,"Y":345.13301062292425},{"X":221.19281528328997,"Y":344.4758980895887},{"X":226.42620690639515,"Y":343.6830651319122},{"X":231.59786107449003,"Y":342.5338086501133},{"X":236.78198025632346,"Y":341.4436039487353},{"X":241.9769109672823,"Y":340.4046178065435},{"X":247.18248122177548,"Y":339.4213670505863},{"X":252.39483767369617,"Y":338.4736658775098},{"X":257.59847785882096,"Y":337.4803044282358},{"X":262.7934085697798,"Y":336.441318286044},{"X":268.0350045254678,"Y":335.72409049768476},{"X":273.31105812449374,"Y":335.24444926140967},{"X":278.53591948549155,"Y":334.43646233655744},{"X":283.70757365358645,"Y":333.28720585475855},{"X":288.9495518761905,"Y":332.5611609026455},{"X":294.21495967421845,"Y":331.9761155917535},{"X":299.48036747224637,"Y":331.3910702808615},{"X":304.7565186041077,"Y":331},{"X":310.0537831813512,"Y":330.9923166883784},{"X":315.2983481155877,"Y":330.2430931263446},{"X":320.57888263240716,"Y":330},{"X":325.8766932457955,"Y":330},{"X":331.1745038591838,"Y":330},{"X":336.4723144725721,"Y":330},{"X":341.6575585767543,"Y":330.9143896441886},{"X":346,"Y":332.530616511358},{"X":349,"Y":336}]
			),
			new Unistroke(
				'five',
				[{"X":395,"Y":146},{"X":379.97643949588763,"Y":146},{"X":364.95287899177526,"Y":146},{"X":349.9293184876629,"Y":146},{"X":335.0288636091682,"Y":145},{"X":320.12457476701604,"Y":144.031143691754},{"X":305.1048482265611,"Y":144},{"X":290.08128772244874,"Y":144},{"X":275.180832843954,"Y":145},{"X":260.15727233984165,"Y":145},{"X":246.02006135310197,"Y":142},{"X":230.9965008489896,"Y":142},{"X":215.97294034487723,"Y":142},{"X":205,"Y":146.05062015923514},{"X":205,"Y":161.0741806633475},{"X":205,"Y":176.09774116745987},{"X":205,"Y":191.12130167157224},{"X":206,"Y":206.02175655006695},{"X":206,"Y":221.04531705417932},{"X":204,"Y":235.74432223795492},{"X":202,"Y":250.5620145861514},{"X":202,"Y":265.5855750902638},{"X":201,"Y":280.44685793420774},{"X":199,"Y":294.89392721577866},{"X":201.72912481534124,"Y":296.2708751846588},{"X":212.8866288471682,"Y":286.29069692226545},{"X":224.76398520907776,"Y":277.1573431939482},{"X":237.64860141102648,"Y":269.900932392649},{"X":250.94098213893668,"Y":263.0295089305317},{"X":265.1189223226186,"Y":258.5762155354763},{"X":279.7608709243467,"Y":256},{"X":294.6221537682907,"Y":255},{"X":309.3211589520663,"Y":257},{"X":323.860531652181,"Y":260.36879927950616},{"X":337.67318977406086,"Y":266.22439659135364},{"X":350.48901807399534,"Y":273.74450903699767},{"X":362.5075074107209,"Y":282.5075074107209},{"X":372.8093708246473,"Y":293.21405623697103},{"X":381.40462403488453,"Y":305.40462403488453},{"X":389.0972846057847,"Y":318.1945692115694},{"X":393.2785909435206,"Y":332.50731849168557},{"X":394,"Y":347.4909236555512},{"X":389.7263448653196,"Y":361.8209654040411},{"X":384.55110693635913,"Y":375.8977861272818},{"X":377.81481024830464,"Y":389.27778462754304},{"X":370.169442273739,"Y":402.2034760209567},{"X":361.7978890556079,"Y":414.64253313327043},{"X":352.5661274740912,"Y":426.4338725259088},{"X":341.942865964067,"Y":437.057134035933},{"X":330.46304107325534,"Y":446.66925637624615},{"X":317.50948667368937,"Y":454.2452566631553},{"X":303.52332786783245,"Y":459.66683524625864},{"X":289.2400718727629,"Y":464.29816221651924},{"X":274.4795542312264,"Y":466.7745859789794},{"X":259.5078133151881,"Y":468},{"X":244.5320883351152,"Y":467.4220147225192},{"X":230.11650833928599,"Y":463.5485451413692},{"X":216.37555349429667,"Y":457.4810246896754},{"X":203.8312769457215,"Y":449.38969500099944},{"X":192.00014791579295,"Y":440.1305505427945},{"X":180.96850198784233,"Y":429.96850198784233},{"X":171.2373857938359,"Y":418.54673224229487},{"X":162.04617503972054,"Y":406.6646450556088},{"X":154,"Y":394}]
			),
			new Unistroke(
				'six',
				[{"X":364,"Y":105},{"X":352.2689053171381,"Y":98},{"X":337.9388787774103,"Y":101},{"X":323.78287475666804,"Y":105.07237508111065},{"X":310.0016380496704,"Y":110.99945398344319},{"X":297.1889561747823,"Y":118.35828286891328},{"X":284.97635349118065,"Y":127.01182325440969},{"X":273.0555733804319,"Y":135.47221330978405},{"X":263.33151787282463,"Y":146.66848212717537},{"X":253.82853171574723,"Y":158.17146828425277},{"X":243.9383134620418,"Y":169.0616865379582},{"X":233.8323712871525,"Y":180.1676287128475},{"X":225.26210778264308,"Y":192.47578443471386},{"X":216.5560896723999,"Y":204.66586549140013},{"X":208.8621349831879,"Y":217.5631083613535},{"X":200.9214564707937,"Y":230.15708705841263},{"X":194.43159599792045,"Y":243.70521200623867},{"X":189.57288557720045,"Y":257.8542288455991},{"X":184.127935307957,"Y":271.744129384086},{"X":178.57659080468437,"Y":285.69363678126257},{"X":175.165978062464,"Y":300.336087750144},{"X":172.7780435538783,"Y":315.10978223060846},{"X":169.788282847772,"Y":329.846868608912},{"X":167.34781260569696,"Y":344.6087495772121},{"X":167,"Y":359.60416236101725},{"X":167,"Y":374.6423928332444},{"X":168.11406188784497,"Y":389.5703094392249},{"X":171.2546939873128,"Y":404.27346993656397},{"X":175.33792413683543,"Y":418.67584827367085},{"X":182.76810715555808,"Y":431.6908095407441},{"X":192.28927859407,"Y":443.28927859406997},{"X":202.74737932665067,"Y":453.9624138047505},{"X":214.6341281518024,"Y":463.08941876786827},{"X":228.7400329525695,"Y":468.10571899322423},{"X":243.57539892652028,"Y":469.8584663088401},{"X":258.590661642511,"Y":470},{"X":273.10063422888055,"Y":467.4496828855597},{"X":287.3098080137924,"Y":463},{"X":301.3434328627467,"Y":458.1043780915022},{"X":313.74182996059153,"Y":449.6065360315268},{"X":325.9415800312626,"Y":441.3528066562458},{"X":336.575502125509,"Y":430.9093974493892},{"X":344.4191681675151,"Y":418.16166366496975},{"X":349.4806890607399,"Y":404.0772437570404},{"X":352.5293208984077,"Y":389.35339550796135},{"X":355,"Y":374.60798270266747},{"X":355,"Y":359.5697522304403},{"X":351.36096146101073,"Y":345.0828843830322},{"X":344.1213550145842,"Y":332.1213550145842},{"X":333.6499979307946,"Y":321.6499979307946},{"X":324.1153827004294,"Y":310.1153827004294},{"X":314.2172082330042,"Y":299.10860411650214},{"X":301.3779770178397,"Y":291.68898850891986},{"X":287.2252956274388,"Y":287},{"X":272.43327640644696,"Y":285},{"X":257.3950459342198,"Y":285},{"X":242.87826672527848,"Y":288},{"X":228.79537675676016,"Y":292.0682077477466},{"X":215.14772763908934,"Y":296.85227236091066},{"X":202.1670036984555,"Y":302.91649815077227},{"X":190.33414777775886,"Y":311.7772348148274},{"X":178.7493557761708,"Y":321.25064422382917},{"X":167.95292088415619,"Y":331.57061867376575},{"X":162,"Y":344}]
			),
			new Unistroke(
				'seven',
				[{"X":207,"Y":175},{"X":215.26194406764898,"Y":175},{"X":223.52388813529797,"Y":175},{"X":231.78583220294695,"Y":175},{"X":240.04777627059593,"Y":175},{"X":248.21090036372678,"Y":174.1972749090683},{"X":256.44855878027624,"Y":174},{"X":264.7105028479252,"Y":174},{"X":272.875885356311,"Y":173.0248229287378},{"X":281.13537146963046,"Y":173},{"X":289.39731553727944,"Y":173},{"X":297.6592596049284,"Y":173},{"X":305.9212036725774,"Y":173},{"X":314.10038520992816,"Y":172},{"X":322.2776157905929,"Y":171.1444768418814},{"X":330.4144790949415,"Y":169.7171041810117},{"X":338.60541585539136,"Y":169},{"X":346.7442542974227,"Y":168},{"X":354.883092739454,"Y":167},{"X":363.140706370656,"Y":167.035176592664},{"X":371.2179910056342,"Y":168.40599700187806},{"X":379.26043603099725,"Y":170},{"X":387.2369968128602,"Y":172},{"X":394.1812316047654,"Y":175.1812316047654},{"X":398.0776280155648,"Y":182.38814007782398},{"X":399.5850551131162,"Y":190.51033067869716},{"X":400,"Y":198.73793285757333},{"X":400,"Y":206.9998769252223},{"X":399.5387088513848,"Y":215.2290380403063},{"X":397.776749989664,"Y":223.281375036176},{"X":395.5070193967744,"Y":231.22543211128954},{"X":393.4438027574347,"Y":239.22478897026127},{"X":390.7415394655004,"Y":247.0225614253322},{"X":387.502232698287,"Y":254.6199764288543},{"X":384.20249699673576,"Y":262.19417367428315},{"X":380.94795778470717,"Y":269.7880985023499},{"X":377.6934185726786,"Y":277.38202333041664},{"X":373.8866768409005,"Y":284.70775912501574},{"X":370.0010957183199,"Y":291.9978085633602},{"X":366.30624200600704,"Y":299.3875159879859},{"X":362.7898378609071,"Y":306.8623567060044},{"X":359.32023701582386,"Y":314.3595259683523},{"X":355.625383303511,"Y":321.74923339297794},{"X":351.9305295911982,"Y":329.13894081760367},{"X":348.23567587888533,"Y":336.52864824222934},{"X":344.7586031082717,"Y":344.0230265987447},{"X":341.2039485705118,"Y":351.47838122619237},{"X":337.2869623501142,"Y":358.75278420693076},{"X":333.0928603708185,"Y":365.8607094437722},{"X":328.5099583752918,"Y":372.7350624370623},{"X":323.927056379765,"Y":379.60941543035244},{"X":319.34415438423827,"Y":386.4837684236426},{"X":314.636204472766,"Y":393.2729560703989},{"X":309.91810161224856,"Y":400.0552289323927},{"X":305.19999875173113,"Y":406.8375017943865},{"X":300.4713225644083,"Y":413.6123963365596},{"X":295.69115045174317,"Y":420.34745574178896},{"X":290.2022135747618,"Y":426.522509728393},{"X":284.7422633310202,"Y":432.7231276216912},{"X":279.41666438359005,"Y":439.03571722109854},{"X":274.34432137387165,"Y":445.5573010907364},{"X":268.98818676206145,"Y":451.8471154442617},{"X":264.0804170805639,"Y":458.4874160872105},{"X":259,"Y":465}]
			),
			new Unistroke(
				'eight',
				[{"X":400,"Y":124},{"X":388.3923242219529,"Y":109.3923242219529},{"X":372.74092169335,"Y":98.870460846675},{"X":354.5801527014134,"Y":93.14503817535335},{"X":335.9665291954391,"Y":89.3221763984797},{"X":317.3966314415215,"Y":85.34915786038037},{"X":298.61420699794473,"Y":83},{"X":279.74832068113005,"Y":82.75055977295665},{"X":262.6188195179346,"Y":90.28588536154908},{"X":247.97926378742292,"Y":102.45226995723094},{"X":234.2951248263258,"Y":115.7048751736742},{"X":221.71699047047008,"Y":130.0440127060399},{"X":211.81449316007993,"Y":146.3710136798401},{"X":209,"Y":164.9649736327201},{"X":212.41387437941654,"Y":183.65549751766616},{"X":221.17727141510136,"Y":200.17727141510136},{"X":234.16796083497576,"Y":214.16796083497576},{"X":249.43796694605595,"Y":225.21898347302798},{"X":266.8400347785168,"Y":232.8400347785168},{"X":282.551644242011,"Y":243.36776282800733},{"X":298.5422510539745,"Y":253.77112552698725},{"X":314.5930070025819,"Y":263.72867133505457},{"X":330.30433760351553,"Y":274.30433760351553},{"X":345.37576833170885,"Y":285.9171788878059},{"X":360.460423050852,"Y":297.460423050852},{"X":373.13441449392093,"Y":311.7016217408814},{"X":385.7614313115338,"Y":325.7614313115338},{"X":395.9059073174999,"Y":341.81181463499973},{"X":401.59222533224187,"Y":359.96112666120945},{"X":404.5820726758023,"Y":378.82072675802266},{"X":404.03693771199374,"Y":397.8153114400312},{"X":395.2441950831038,"Y":414.67440655586154},{"X":383.3038939547699,"Y":429.4787903861018},{"X":369.4388887451422,"Y":442.5611112548578},{"X":354.7884574977418,"Y":454.6057712511291},{"X":338.6053915612787,"Y":464.69730421936066},{"X":319.9671612575486,"Y":468.2582096856129},{"X":300.9476887920741,"Y":469},{"X":282.03555355776604,"Y":467.58158673079026},{"X":263.90917009096864,"Y":462.11690574027676},{"X":246.03088920911,"Y":455.412355683644},{"X":229.21717581763943,"Y":446.4128818632296},{"X":215.17695250166702,"Y":433.76542875250055},{"X":206.91959691780494,"Y":416.6783876712198},{"X":204,"Y":397.8788432260836},{"X":204,"Y":378.7680521998793},{"X":208.56071714949508,"Y":360.31784855151477},{"X":216.67222510346588,"Y":343.1036998620455},{"X":228.6989930925774,"Y":328.3010069074226},{"X":241.68467045197673,"Y":314.31532954802327},{"X":255.19804038044475,"Y":300.80195961955525},{"X":269.18872980031915,"Y":287.81127019968085},{"X":283.4172919209676,"Y":275.0661664632259},{"X":298.935646584303,"Y":264.03217670784846},{"X":314.03753891626036,"Y":252.40175791695688},{"X":329.35929241339295,"Y":240.9805306899553},{"X":344.4100462862017,"Y":229.2785383669988},{"X":359.7812264161409,"Y":218.10938679192955},{"X":374.2840483861812,"Y":205.81063440921253},{"X":389.0697059557878,"Y":193.90705872561625},{"X":400.97494161651724,"Y":179.02505838348276},{"X":414.95277763905256,"Y":166.04722236094744},{"X":428.57973265426375,"Y":152.8405346914725},{"X":431,"Y":138}]
			),
			new Unistroke(
				'nine',
				[{"X":361,"Y":91},{"X":348.89119774012806,"Y":82},{"X":333.69195889832,"Y":75.84597944916001},{"X":318.1186457870867,"Y":70.70621526236224},{"X":301.7089986716094,"Y":68.56966622386979},{"X":284.97129116188563,"Y":68},{"X":268.6331209309073,"Y":70.1222930230309},{"X":252.89677344665225,"Y":76.03440885111593},{"X":237.5595163156551,"Y":82.72024184217246},{"X":223.0359932137145,"Y":90.98200339314275},{"X":209.73673770645124,"Y":101.17550819569918},{"X":197.02155540409115,"Y":111.65229639727256},{"X":185.36678716604067,"Y":123.63321283395933},{"X":174.76027043917892,"Y":136.54966195102634},{"X":164.93919446006987,"Y":150.12161107986026},{"X":157.7038153188749,"Y":165.24046170281278},{"X":154,"Y":181.30065725347873},{"X":153,"Y":197.96853120492065},{"X":154,"Y":214.63640515636257},{"X":158.23182562582085,"Y":230.34773843873128},{"X":168.61278333595743,"Y":243.30639166797872},{"X":184.15219369270062,"Y":249},{"X":200.41118983571855,"Y":252},{"X":217.24134144732884,"Y":252},{"X":233.73640556784656,"Y":250},{"X":248.87871764977328,"Y":243.4485129400907},{"X":263.2840226492905,"Y":235.35798867535476},{"X":276.4694354134625,"Y":225.35370972435834},{"X":290.35181310695276,"Y":216.18891213582836},{"X":303.7300646923934,"Y":206.26993530760657},{"X":315.6145436733563,"Y":194.51394176885827},{"X":325.3359691609781,"Y":180.99604625853283},{"X":334.3564262154162,"Y":168.6435737845838},{"X":343.696517250547,"Y":155.303482749453},{"X":352,"Y":141.20016396810396},{"X":359,"Y":126.66128022115402},{"X":364.8426292287957,"Y":111.31474154240858},{"X":372,"Y":96.6348624102611},{"X":373.04959701941664,"Y":106.70241788350005},{"X":369.316240306486,"Y":123.10255816108403},{"X":367.2500961441203,"Y":139.74951927939847},{"X":365.31098284595527,"Y":156.44508577022364},{"X":363.4802227662768,"Y":173.1186634023392},{"X":361.5380304532495,"Y":189.77181728050303},{"X":359.86648896330036,"Y":206.46862140369626},{"X":358,"Y":223.1767056642515},{"X":357,"Y":239.92409474556356},{"X":356.0540077261751,"Y":256.67595364294954},{"X":355.3633726110034,"Y":273.4563917229763},{"X":355,"Y":290.26071923823076},{"X":353.413249679027,"Y":306.9337516048651},{"X":352,"Y":323.5998778086481},{"X":351,"Y":340.30692379464074},{"X":350,"Y":357.0139697806334},{"X":350,"Y":373.84412139224366},{"X":350,"Y":390.67427300385395},{"X":350,"Y":407.50442461546425},{"X":348.0201656582522,"Y":423.9395030252433},{"X":348,"Y":440.76638220101665},{"X":348,"Y":457.59653381262694},{"X":348,"Y":474.42668542423723},{"X":349,"Y":491.1740745055493},{"X":351.9231359648721,"Y":507.6925438594883},{"X":355,"Y":523}]
			)
		];
	}

	// The $1 Gesture Recognizer API begins here -- 3 methods: Recognize(), AddGesture(), and DeleteUserGestures()
	Recognize(points, useProtractor) {
		points = Resample(points, NumPoints);
		const radians = IndicativeAngle(points);
		points = RotateBy(points, -radians);
		points = ScaleTo(points, SquareSize);
		points = TranslateTo(points, Origin);

		const vector = Vectorize(points); // for Protractor

		let b = +Infinity;
		let u = -1;

		this.Unistrokes.forEach(function(unistroke, i) {
			const d = useProtractor
				? OptimalCosineDistance(this.Unistrokes[i].Vector, vector)
				: DistanceAtBestAngle(points, this.Unistrokes[i], -AngleRange, +AngleRange, AnglePrecision);
			if (d < b) {
				b = d;
				u = i;
			}
		}, this);

		return u === -1
			? new Result("No match.", 0.0)
			: new Result(this.Unistrokes[u].Name, useProtractor ? 1.0 / b : 1.0 - b / HalfDiagonal);
	}

	AddGesture(name, points) {
		this.Unistrokes.push(new Unistroke(name, points)); // append new unistroke
		var num = 0;
		for (var i = 0; i < this.Unistrokes.length; i++) {
			if (this.Unistrokes[i].Name == name)
				num++;
		}
		return num;
	}

	DeleteUserGestures() {
		this.Unistrokes.length = NumUnistrokes; // clear any beyond the original set
		return NumUnistrokes;
	}
}

//
// Private helper functions from this point down
//
function Resample(points, n) {
	const I = PathLength(points) / (n - 1); // interval length
	let D = 0;
	let newpoints = [points[0]];
	for (let i = 1; i < points.length; i++) {
		const d = Distance(points[i - 1], points[i]);
		if ((D + d) >= I) {
			const qx = points[i - 1].X + ((I - D) / d) * (points[i].X - points[i - 1].X);
			const qy = points[i - 1].Y + ((I - D) / d) * (points[i].Y - points[i - 1].Y);
			const q = new Point(qx, qy);
			newpoints.push(q);
			points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i
			D = 0;
		} else {
			D += d;
		}
	}

	if (newpoints.length === n-1) {
		newpoints.push(
			new Point(points[points.length - 1].X, points[points.length - 1].Y)
		);
	}

	return newpoints;
}

function IndicativeAngle(points) {
	const c = Centroid(points);
	return Math.atan2(c.Y - points[0].Y, c.X - points[0].X);
}

// rotates points around centroid
function RotateBy(points, radians)  {
	const c = Centroid(points);
	const cos = Math.cos(radians);
	const sin = Math.sin(radians);

	return points.map(function(p) {
		const qx = (p.X - c.X) * cos - (p.Y - c.Y) * sin + c.X;
		const qy = (p.X - c.X) * sin + (p.Y - c.Y) * cos + c.Y;
		return new Point(qx, qy);
	});
}

// non-uniform scale; assumes 2D gestures (i.e., no lines)
function ScaleTo(points, size) {
	const B = BoundingBox(points);
	return points.map(function(p) {
		const qx = p.X * (size / B.Width);
		const qy = p.Y * (size / B.Height);
		return new Point(qx, qy);
	});
}

// translates points' centroid
function TranslateTo(points, pt) {
	const c = Centroid(points);

	return points.map(function(p) {
		const qx = p.X + pt.X - c.X;
		const qy = p.Y + pt.Y - c.Y;
		return new Point(qx, qy);
	});
}

// for Protractor
function Vectorize(points)  {
	let vector = [];
	const sum = points.reduce(function(pre, cur) {
		vector.push(cur.X);
		vector.push(cur.Y);
		return pre + (cur.X * cur.X + cur.Y * cur.Y);
	}, 0);

	const magnitude = Math.sqrt(sum);
	return vector.map(v => v / magnitude);
}

// for Protractor
function OptimalCosineDistance(v1, v2) {
	let a = 0;
	let b = 0;

	for (var i = 0; i < v1.length; i += 2) {
		a += v1[i] * v2[i] + v1[i + 1] * v2[i + 1];
		b += v1[i] * v2[i + 1] - v1[i + 1] * v2[i];
	}

	const angle = Math.atan(b / a);
	return Math.acos(a * Math.cos(angle) + b * Math.sin(angle));
}

function DistanceAtBestAngle(points, T, a, b, threshold) {
	let x1 = Phi * a + (1.0 - Phi) * b;
	let f1 = DistanceAtAngle(points, T, x1);
	let x2 = (1.0 - Phi) * a + Phi * b;
	let f2 = DistanceAtAngle(points, T, x2);
	while (Math.abs(b - a) > threshold) {
		if (f1 < f2) {
			b = x2;
			x2 = x1;
			f2 = f1;
			x1 = Phi * a + (1.0 - Phi) * b;
			f1 = DistanceAtAngle(points, T, x1);
		} else {
			a = x1;
			x1 = x2;
			f1 = f2;
			x2 = (1.0 - Phi) * a + Phi * b;
			f2 = DistanceAtAngle(points, T, x2);
		}
	}
	return Math.min(f1, f2);
}

function DistanceAtAngle(points, T, radians) {
	const newpoints = RotateBy(points, radians);
	return PathDistance(newpoints, T.Points);
}
function Centroid(points) {
	let x = 0;
	let y = 0;
	points.forEach(function(p) {
		x += p.X;
		y += p.Y;
	});
	return new Point(x / points.length, y / points.length);
}
function BoundingBox(points) {
	let minX = +Infinity;
	let maxX = -Infinity;
	let minY = +Infinity;
	let maxY = -Infinity;
	points.forEach(function(p) {
		minX = Math.min(minX, p.X);
		minY = Math.min(minY, p.Y);
		maxX = Math.max(maxX, p.X);
		maxY = Math.max(maxY, p.Y);
	});

	return new Rectangle(minX, minY, maxX - minX, maxY - minY);
}
function PathDistance(pts1, pts2) {
	const d = pts1.reduce(function(pre, cur, i) {
		return pre + Distance(cur, pts2[i]);
	}, 0);

	return d / pts1.length;
}
function PathLength(points) {
	let index = 1;
	return points.slice(1).reduce(function(pre, cur) {
		return pre + Distance(points[index++ - 1], cur);
	}, 0);
}
function Distance(p1, p2) {
	const dx = p2.X - p1.X;
	const dy = p2.Y - p1.Y;
	return Math.sqrt(dx * dx + dy * dy);
}
function Deg2Rad(d) { return d * Math.PI / 180.0; }
