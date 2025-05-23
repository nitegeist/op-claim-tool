import { Markdown } from '@/components/common/Markdown';
import { Card, CardContent } from '@/components/ui/card';
import type { Delegate } from '@/types/delegates';
import {
  RiCheckboxCircleFill,
  RiDiscordFill,
  RiFileCopyLine,
  RiTwitterXLine,
} from '@remixicon/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { Address } from 'viem';
import { FEATURES } from '../../../config/features';
import Mirror from '../../../public/mirror.svg';
import { AvatarENS, NameENS } from '../Ens';
import { Button } from '../ui/button';

const { DELEGATES_URL } = FEATURES;

interface DelegateCardProps {
  delegate: Delegate | null;
}

const DelegateCard = ({ delegate }: DelegateCardProps) => {
  if (!delegate?.address) return null;

  const { address, statement } = delegate;
  const { discord, twitter, warpcast, payload } = statement ?? {};
  const { delegateStatement } = payload ?? {};

  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
      setCopied(false);
    }
  };

  const isValidSocialHandle = (handle: string | undefined): boolean => {
    return !!handle && handle !== 'N/A';
  };

  return (
    <Card className="border-none shadow-none p-8">
      <CardContent className="flex flex-col items-start gap-4">
        <div className="flex items-center gap-2">
          <AvatarENS address={address as Address} />
          <div className="flex flex-col">
            <div className="flex items-center">
              <NameENS
                className="font-semibold text-xl"
                address={address as Address}
              />
              <Button size="icon" variant="link" onClick={handleCopyAddress}>
                {copied ? (
                  <RiCheckboxCircleFill className="text-green-600 w-4 h-4" />
                ) : (
                  <RiFileCopyLine className="text-neutral-600 w-4 h-4" />
                )}
              </Button>
            </div>
            <div className="flex items-center gap-2 text-neutral-600">
              {isValidSocialHandle(twitter) && (
                <Link
                  href={`https://twitter.com/${twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <RiTwitterXLine className="h-4 w-4" />
                </Link>
              )}
              {isValidSocialHandle(discord) && (
                <Link
                  href={`https://discord.gg/${discord}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <RiDiscordFill className="w-4 h-4" />
                </Link>
              )}
              {isValidSocialHandle(warpcast) && (
                <Link
                  href={`https://warpcast.com/${warpcast}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image src={Mirror} alt="Mirror" width={16} height={16} />
                </Link>
              )}
            </div>
          </div>
        </div>
        {delegateStatement && (
          <div className="w-full line-clamp-2">
            <Markdown>{delegateStatement}</Markdown>
          </div>
        )}
        {DELEGATES_URL && (
          <Button variant="link" className="p-0" asChild>
            <Link
              href={`${DELEGATES_URL}/${address}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read more
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default DelegateCard;
