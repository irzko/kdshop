export const dynamic = "force-static";
import {
  Flex,
  Grid,
  Heading,
  Container,
  Card,
  Image,
  Badge,
} from "@chakra-ui/react";
import slugify from "slugify";
import NextImage from "next/image";
import NextLink from "next/link";
import { getAllProducts } from "@/lib/db";
import { Metadata } from "next";
import CategoryTabs from "@/components/ui/category-tabs";

const getProducts = async (slug: string) => {
  const products = await getAllProducts();
  return products.filter((product) => {
    return (
      slugify(product.category, {
        replacement: "-",
        remove: undefined,
        lower: true,
        strict: true,
        locale: "vi",
        trim: true,
      }) === slug
    );
  });
};

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const products = await getProducts(slug.replace(".html", ""));

  return {
    title: products ? products[0].category : "No Name",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const products = await getProducts(slug.replace(".html", ""));

  return (
    <Container maxW="5xl" spaceY="1rem" padding="1rem">
      <CategoryTabs slug={slug} />
      <Grid
        templateColumns={[
          "repeat(2, 1fr)",
          "repeat(4, 1fr)",
          "repeat(6, 1fr)",
          "repeat(6, 1fr)",
        ]}
        gap="1rem"
      >
        {products.map((product) => (
          <Card.Root key={product.id} asChild overflow="hidden" border="none">
            <NextLink
              href={`/${slugify(product.name, {
                replacement: "-",
                remove: undefined,
                lower: true,
                strict: true,
                locale: "vi",
                trim: true,
              })}-${product.id}.html`}
            >
              <Flex position="relative" aspectRatio={1}>
                <Image asChild alt={product.name} rounded="2xl">
                  <NextImage
                    src={product.image.split("\n")[0] || "/no-image.jpg"}
                    alt={product.name}
                    style={{ objectFit: "cover" }}
                    fill
                    unoptimized
                  />
                </Image>
              </Flex>
              <Card.Body paddingY="1rem" paddingX="0rem" gap="0.5rem" direction="col">
                <Flex>
                  <Badge
                    colorPalette="blue"
                    variant="solid"
                    size="md"
                    rounded="full"
                  >
                    {Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.price)}
                  </Badge>
                </Flex>
                <Heading lineClamp={2} size="sm">
                  {product.name}
                </Heading>
              </Card.Body>
            </NextLink>
          </Card.Root>
        ))}
      </Grid>
    </Container>
  );
}
