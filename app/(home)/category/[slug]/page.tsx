import {
  Flex,
  Grid,
  Text,
  Heading,
  Container,
  Card,
  Image,
} from "@chakra-ui/react";
import NextImage from "next/image";
import NextLink from "next/link";
import slugify from "slugify";
import { getAllProducts } from "@/lib/db";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const allProducts = await getAllProducts();
  const slug = (await params).slug;

  const matchedProductCategory = allProducts.filter((product) => {
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

  return (
    <Container maxW="5xl" padding="1rem">
      <Heading size="xl" marginBottom="1rem">
        {matchedProductCategory[0].category}
      </Heading>
      <Grid
        templateColumns={[
          "repeat(2, 1fr)",
          "repeat(4, 1fr)",
          "repeat(6, 1fr)",
          "repeat(6, 1fr)",
        ]}
        gap="0.5rem"
      >
        {matchedProductCategory.map((product) => (
          <Card.Root key={product.id} asChild overflow="hidden">
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
                <Image asChild alt={product.name}>
                  <NextImage
                    src={product.image.split("\n")[0] || "/no-image.jpg"}
                    alt={product.name}
                    style={{ objectFit: "cover" }}
                    fill
                    unoptimized
                  />
                </Image>
              </Flex>
              <Card.Body
                gap="0.5rem"
                padding="0.5rem"
                direction="col"
                justifyContent="space-between"
              >
                <Heading lineClamp={2} size="md">
                  {product.name}
                </Heading>
                <Text fontSize="md" color="red.500" fontWeight="bold">
                  {Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.price)}
                </Text>
              </Card.Body>
            </NextLink>
          </Card.Root>
        ))}
      </Grid>
    </Container>
  );
}
