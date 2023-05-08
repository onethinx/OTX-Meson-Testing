/* ==========================================================
 *    ___             _   _     _			
 *   / _ \ _ __   ___| |_| |__ (_)_ __ __  __
 *  | | | | '_ \ / _ \ __| '_ \| | '_ \\ \/ /
 *  | |_| | | | |  __/ |_| | | | | | | |>  < 
 *   \___/|_| |_|\___|\__|_| |_|_|_| |_/_/\_\
 *									   
 * Copyright Onethinx, 2018
 * All Rights Reserved
 *
 * UNPUBLISHED, LICENSED SOFTWARE.
 * CONFIDENTIAL AND PROPRIETARY INFORMATION
 * WHICH IS THE PROPERTY OF Onethinx BV
 *
 * ==========================================================
*/

#ifndef LORAWAN_KEYS_H
#define LORAWAN_KEYS_H

#include "OnethinxCore01.h"


LoRaWAN_keys_t TTN_OTAAkeys = {
	.KeyType 						= OTAA_10x_key,
	.PublicNetwork					= true,
	.OTAA_10x.DevEui				= {{ 0xde, 0xad, 0xbe, 0xef, 0x00, 0x00, 0x19, 0x69 }},
	.OTAA_10x.AppEui				= {{ 0xAE, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08 }},
	.OTAA_10x.AppKey				= {{ 0x13, 0x92, 0xce, 0x0b, 0x9a, 0xbf, 0x3e, 0x22, 0x84, 0x73, 0x12, 0xff, 0x30, 0x6b, 0x60, 0x21 }}
};
//1392ce0b9abf3e22847312ff306b6021
#endif /* LORAWAN_KEYS_H */
/* [] END OF FILE */
//