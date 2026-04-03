"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  EXPERTISE_AREAS,
  EXPERTISE_COPY,
  FIRM_TABS,
  IMAGE_EXPERTISE_HERO,
  IMAGE_THE_FIRM_BUILDING,
  IMAGE_OUR_PROFESSIONALS,
  NEWS_ITEMS,
  type ExpertiseSlug,
  type NewsItem,
  IMAGE_THE_FIRM_2,
  USER_IMAGE,
} from "./content";
import { EXPERTISE_ANIMATED_ICON_BY_SLUG } from "@/components/icons/expertise-icon";
import { HOME_VT } from "./home-view-transition";
import { HomeNewsMarquee } from "./home-news-marquee";
import { cn } from "@/lib/utils";
import {
  subnavFirmSegmentClass,
  FIRM_EXTERNAL_PROGRESS,
  FIRM_INTERNAL_STOPS,
  STAGE_TO_TAB,
  TAB_TO_STAGE,
  CARDS_STAGE_INDEX,
  SUBNAV_MIN_STYLE,
  subnavRowClass,
  subnavPrimaryBtnClass,
  sectionTitle,
  PROFESSIONALS_ITEMS,
  PROFESSIONALS_DETAILS,
  PROFESSIONALS_STOPS,
} from "@/constant/variabls";
import { FirmSubnavWithProgress } from "./firm-progress";









