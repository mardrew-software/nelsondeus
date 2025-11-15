import { Settings } from "@/types";
import { AppleLogoIcon, EqualizerIcon, InstagramLogoIcon, MagnifyingGlassIcon, SoundcloudLogoIcon, SpotifyLogoIcon, TidalLogoIcon, YoutubeLogoIcon } from "@phosphor-icons/react";

const TopBar = ({ setOpenSearch, settings }: { setOpenSearch: (open: boolean) => void, settings: Settings | null }) => {

    return <div className='shadow-md bg-white border-b-1 flex flex-row gap-1 items-center justify-between p-2 px-2 sm:px-4'>
        <div className="items-center flex flex-row gap-2">
            <div className='flex sm:hidden cursor-pointer' onClick={() => setOpenSearch(true)}>
                <MagnifyingGlassIcon weight='bold' size={20} />
            </div>
            {settings?.artistName || 'nelson deus'}
        </div>
        <div className='flex flex row gap-8 '>

            <div className='flex flex-row gap-2'>
                {(() => {
                    const SocialIconMap: Record<string, React.ElementType> = {
                        instagram: InstagramLogoIcon,
                        youtube: YoutubeLogoIcon,
                        soundcloud: SoundcloudLogoIcon,
                        tidal: TidalLogoIcon,
                        apple: AppleLogoIcon,
                        deezer: EqualizerIcon,
                        spotify: SpotifyLogoIcon
                    };

                    return (settings?.socials ?? []).map((s) => {
                        const IconComponent = SocialIconMap[s.platform];
                        return IconComponent ? (
                            <a className='cursor-pointer' key={s.id} href={s.url} target="_blank" rel="noreferrer">
                                <IconComponent color="black" weight='duotone' size={20} />
                            </a>
                        ) : (
                            <></>
                        );
                    });
                })()}
            </div>
            <div className='hidden sm:flex cursor-pointer' onClick={() => setOpenSearch(true)}>
                <MagnifyingGlassIcon weight='bold' size={20} />
            </div>
        </div>
    </div>
}

export default TopBar;