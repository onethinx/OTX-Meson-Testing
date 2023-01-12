project('meson_test', 'c',
	version : '0.1',
	default_options : ['warning_level=3']
)

[host_machine]
system     = 'none'
cpu_family = 'arm'
cpu        = 'cortex-m4'
endian     = 'little'

#==============================================================================#
# initialize some globals
srcs          = []
incdirs       = []
c_args        = []
link_args     = []
link_deps     = []

#==============================================================================#
# set directories

if build_machine.system() == 'windows'
	PROJECTNAME =  meson.current_source_dir().split('\\').get(-1)
	ONETHINX_PACK_LOC = run_command('cmd', '/C', 'echo %ONETHINX_PACK_LOC%', check: true).stdout().strip()
	ONETHINX_TOOLS_LOC = run_command('cmd', '/C', 'echo %ONETHINX_TOOLS_LOC%', check: true).stdout().strip()
else
	PROJECTNAME =  meson.current_source_dir().split('/').get(-1)
	ONETHINX_PACK_LOC = run_command('sh', '-c', 'echo $ONETHINX_PACK_LOC', check: true).stdout().strip()
	ONETHINX_TOOLS_LOC = run_command('sh', '-c', 'echo $ONETHINX_TOOLS_LOC', check: true).stdout().strip()
endif

CONFIG_DIR = ONETHINX_PACK_LOC + '/config'

MESON_SOURCE_LOC = meson.current_source_dir()
CREATOR_DIR = 'Onethinx_Creator.cydsn'

#==============================================================================#
# import tools

objcopy  		= find_program('arm-none-eabi-objcopy').path()
objdump  		= find_program('arm-none-eabi-objdump').path()
size     		= find_program('arm-none-eabi-size').path()
gdb      		= find_program('arm-none-eabi-gdb').path()
cymcuelftool 	= find_program(ONETHINX_TOOLS_LOC + '/cymcuelftool-1.0/bin/cymcuelftool').path()
readelf  		= find_program('arm-none-eabi-readelf').path()
memcalc 		= find_program(CONFIG_DIR + '/scripts/memcalc').path()

#==============================================================================#
# setup compile & link arguments

c_args     += [
	'-g',
	'-DDEBUG',
	'-DCY_CORE_ID=0',
	'-DCY_PSOC_CREATOR_USED=1',
	'-Wall',
	'-ffunction-sections',
	'-ffat-lto-objects',
	'-Og',
	'-c',
	'-DCY8C6347BZI_BLD53',
	'-mthumb',
	'-mcpu=cortex-m4',
	'-mfloat-abi=softfp',
	'-mfpu=fpv4-sp-d16'
]

link_args     = [
	#'-Wl,--start-group',
	'-mcpu=cortex-m4',
	'-mfloat-abi=softfp',
	'-mfpu=fpv4-sp-d16',
	'-mthumb',
	'-Wl,-Map,'+PROJECTNAME+'.map',
	'-T'+ONETHINX_PACK_LOC+'/linker/OnethinxCore_18.ld',
	'-specs=nano.specs',
	'-Wl,--gc-sections',
	'-g',
	'-ffunction-sections',
	'-Og',
	'-ffat-lto-objects',
	#'-Wl,--end-group'
]

incdirs       = [
# OTX_Extension_HeaderFiles_Start - automatic insert of source files by CoreStripper. Do not edit below this line
	'source/OnethinxCore',
	'source',
# OTX_Extension_HeaderFiles_End - automatic insert of source files by CoreStripper. Do not edit above this line
# CoreStripper_IncludeHeaderDirs_Start - automatic insert of include header dirs by CoreStripper. Do not edit below this line
	'Onethinx_Creator.cydsn/',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/cmsis/include/',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/devices/psoc6/include/',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/devices/psoc6/include/ip/',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/device/',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/efuse/',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/flash/',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/gpio/',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/ipc/',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/lvd/',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/profile/',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/prot/',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/sysanalog/',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/sysclk/',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/sysint/',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/syslib/',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/syspm/',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/systick/',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/trigmux/',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/wdt/',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/middleware/',
# CoreStripper_IncludeHeaderDirs_End - automatic insert of include header dirs by CoreStripper. Do not edit above this line
]

sourcefiles       = [
	CREATOR_DIR + '/gcc/startup_psoc6_01_cm4.S',
	CREATOR_DIR + '/system_psoc6_cm4.c',
# OTX_Extension_SourceFiles_Start - automatic insert of source files by CoreStripper. Do not edit below this line
	'source/OnethinxCore/OnethinxCore01.c',
	'source/main.c',
# OTX_Extension_SourceFiles_End - automatic insert of source files by CoreStripper. Do not edit above this line
# CoreStripper_SourceFiles_Start - automatic insert of source files by CoreStripper. Do not edit below this line
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/cyfitter_cfg.c',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/cyfitter_sysint_cfg.c',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/cymetadata.c',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/efuse/cy_efuse.c',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/flash/cy_flash.c',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/gpio/cy_gpio.c',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/ipc/cy_ipc_drv.c',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/ipc/cy_ipc_pipe.c',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/ipc/cy_ipc_sema.c',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/lvd/cy_lvd.c',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/profile/cy_profile.c',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/prot/cy_prot.c',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/sysanalog/cy_sysanalog.c',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/sysclk/cy_sysclk.c',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/sysint/cy_sysint.c',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/syslib/cy_syslib.c',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/syslib/gcc/cy_syslib_gcc.S',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/syspm/cy_syspm.c',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/systick/cy_systick.c',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/trigmux/cy_trigmux.c',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/wdt/cy_wdt.c',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/drivers/peripheral/device/cy_device.c',
	'Onethinx_Creator.cydsn/Generated_Source/PSoC6/pdl/middleware/ble/cy_ble_clk.c',
# CoreStripper_SourceFiles_End - automatic insert of include source files by CoreStripper. Do not edit above this line
]

#==============================================================================#
# include libraries

cc = meson.get_compiler('c')

# example: include library.a from directory
#link_deps += declare_dependency( dependencies : cc.find_library('library', dirs : ['directory/libdir']) )

# example: include object.o from directory
#link_deps += declare_dependency( link_args : ['directory/libdir/object.o'] )

#==============================================================================#
# run prebuild script 

#prebuild = custom_target('prebuild', output : 'buildversion.h', command : [MESON_SOURCE_LOC+'/config/prebuild.bash']) #use prebuild.bash / prebuild.bat file
#link_deps += declare_dependency( sources : [prebuild])

#==============================================================================#
# build executable

main = executable(
            PROJECTNAME,          [sourcefiles],
            name_suffix         : 'elf',
            c_args              : [c_args],
            link_args           : [link_args],
            dependencies        : link_deps,
            include_directories : [incdirs] )

#==============================================================================#
# run post build

signed = custom_target(
                        PROJECTNAME + '_signed.elf',
    output           : [PROJECTNAME + '_signed.elf'],
    build_by_default : true,
    command          : [cymcuelftool, '--sign',  PROJECTNAME + '.elf', '--output', PROJECTNAME + '_signed.elf', '--hex', PROJECTNAME + '.hex'],
    depends          : [main])
	
mainout = custom_target(
                        PROJECTNAME + '.memcalc.txt',
    output           :  [PROJECTNAME + '.memcalc.txt'],
    build_by_default : true,
	console			 : true,
    command          : [memcalc, readelf, PROJECTNAME + '.elf', '0x0e0000', '0x38000', '0x10000000', '0x08000000', PROJECTNAME + '.memcalc.txt'],  #Flash 0x0e0000   SRAM 0x38000   Flash start 0x10000000   SRAM start 0x08000000
   # command          : [memcalc, PROJECTNAME + '.readelf', '0x0e0000', '0x38000', '0x10000000', '0x08000000', PROJECTNAME + '.memcalc2.txt'],  #Flash 0x0e0000   SRAM 0x38000   Flash start 0x10000000   SRAM start 0x08000000
    depends          : [main])
